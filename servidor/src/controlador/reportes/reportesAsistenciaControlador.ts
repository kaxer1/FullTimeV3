import { Request, Response } from 'express'
import { dep, emp, IHorarioTrabajo, IReporteAtrasos, IReportePuntualidad, IReporteTimbres, tim_tabulado } from '../../class/Asistencia';
import pool from '../../database'
import { HHMMtoSegundos, SumarValoresArray } from '../../libs/SubMetodosGraficas';
import { HorariosParaInasistencias } from '../../libs/MetodosHorario'
import moment from 'moment';

class ReportesAsistenciaControlador {

    public async Departamentos(req: Request, res: Response) {
        let estado = req.params.estado;
        console.log('Estado: ', estado);
        
        let suc = await pool.query('SELECT s.id AS id_suc, s.nombre AS name_suc, c.descripcion AS ciudad FROM sucursales AS s, ciudades AS c WHERE s.id_ciudad = c.id ORDER BY s.id')
            .then(result => { return result.rows });
        
        if (suc.length === 0) return res.status(404).jsonp({message: 'No tiene sucursales registrados'})
        
        let departamentos = await Promise.all(suc.map(async(ele: any) => {
            ele.departamentos = await pool.query('SELECT d.id as id_depa, d.nombre as name_dep FROM cg_departamentos AS d ' + 
            'WHERE d.id_sucursal = $1',[ele.id_suc])
            .then(result => {
                return result.rows.filter(obj => {
                    return obj.name_dep != 'Ninguno'
                })
            });
            return ele
        }));

        let depa = departamentos.filter(obj => {
            return obj.departamentos.length > 0
        });
        
        if (depa.length === 0) return res.status(404).jsonp({message: 'No tiene departamentos registrados'})

        let lista = await Promise.all( depa.map(async(obj: any) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele: any) => {
                if (estado === '1') {
                    ele.empleado = await pool.query('SELECT DISTINCT e.id, CONCAT(nombre, \' \', apellido) name_empleado, e.codigo, e.cedula, e.genero FROM empl_cargos AS ca, empl_contratos AS co, cg_regimenes AS r, empleados AS e ' + 
                    'WHERE ca.id_departamento = $1 AND ca.id_empl_contrato = co.id AND co.id_regimen = r.id AND co.id_empleado = e.id AND e.estado = $2',[ele.id_depa, estado])
                    .then(result => { return result.rows })
                } else {
                    ele.empleado = await pool.query('SELECT DISTINCT e.id, CONCAT(nombre, \' \', apellido) name_empleado, e.codigo, e.cedula, e.genero, ca.fec_final FROM empl_cargos AS ca, empl_contratos AS co, cg_regimenes AS r, empleados AS e ' + 
                    'WHERE ca.id_departamento = $1 AND ca.id_empl_contrato = co.id AND co.id_regimen = r.id AND co.id_empleado = e.id AND e.estado = $2',[ele.id_depa, estado])
                    .then(result => { return result.rows })
                }

                return ele
            }));
            return obj
        }))

        if (lista.length === 0) return res.status(404).jsonp({message: 'No tiene empleados asignados a los departamentos'})

        let respuesta = lista.map(obj => {
            obj.departamentos = obj.departamentos.filter((ele: any) => {
                return ele.empleado.length > 0
            })
            return obj
        }).filter(obj => {
            return obj.departamentos.length > 0
        });

        if (respuesta.length === 0) return res.status(404).jsonp({message: 'No tiene departamentos con empleados'})
        
        res.status(200).jsonp(respuesta)
    }

    public async ReporteAtrasosMultiple(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body
        // console.log(datos);
        let n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele:dep) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o:emp) => {
                    
                        let timbres = await BuscarTimbresEoSReporte(desde, hasta, o.codigo);
                        o.timbres = await Promise.all(timbres.map(async(e) => {
                            return await ModelarAtrasosReporte(e);
                        }))
                        console.log(o);
                        return o})
                    )
                return ele})
                )
            return obj})
        )

        let nuevo = n.map((obj: any) => {

            obj.departamentos = obj.departamentos.map((e:any) => {                

                e.empleado = e.empleado.map((t:any) => {
                    
                    t.timbres = t.timbres.filter((a: any) => { return a != 0 })
                    return t

                }).filter((t: any) => { return t.timbres.length > 0 })
                    console.log('Empleados: ',e);
                return e

            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay atrasos de empleados en ese periodo'})

        return res.status(200).jsonp(nuevo)
    }

    public async ReporteFaltasMultiple(req: Request, res: Response) {

        let {desde, hasta} = req.params
        console.log(desde, hasta);
        let datos: any[] = req.body
        console.log(datos);
        let n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele:dep) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o:emp) => {
                    
                        let faltas = await BuscarHorarioEmpleado(desde, hasta, o.codigo);
                        o.faltas = faltas.filter(o => {
                            return o.registros === 0
                        }).map(o => { 
                            return { fecha: o.fecha }
                        })
                        
                        return o})
                    )
                return ele})
                )
            return obj})
        )

        let nuevo = n.map((obj: any) => {

            obj.departamentos = obj.departamentos.map((e:any) => {                
                
                e.empleado = e.empleado.filter((t: any) => { return t.faltas.length > 0 })
                return e

            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay faltas de empleados en ese periodo'})

        return res.status(200).jsonp(nuevo)
    }
    
    public async ReporteFaltasMultipleTabulado(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body
        // console.log(datos);
        let n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele:dep) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o:emp) => {
                        o.contrato = await pool.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato})
                        o.cargo = await pool.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo})
                        let faltas = await BuscarHorarioEmpleado(desde, hasta, o.codigo);
                        o.faltas = faltas.filter(o => {
                            return o.registros === 0
                        }).map(o => { 
                            return { fecha: o.fecha }
                        })
                        
                        return o})
                    )
                return ele})
                )
            return obj})
        )

        let nuevo = n.map((obj: any) => {

            obj.departamentos = obj.departamentos.map((e:any) => {                
                
                e.empleado = e.empleado.filter((t: any) => { return t.faltas.length > 0 })
                return e

            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay faltas de empleados en ese periodo'})

        return res.status(200).jsonp(nuevo)
    }

    public async ReporteHorasTrabajaMultiple(req: Request, res: Response) {

        let {desde, hasta} = req.params
        console.log(desde, hasta);
        let datos: any[] = req.body
        console.log(datos);
        let n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele:dep) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o:emp) => {
                        o.timbres = await ModelarHorasTrabajaReporte(o.codigo, desde, hasta);
                        return o})
                    )
                return ele})
                )
            return obj})
        )

        let nuevo = n.map((obj: any) => {

            obj.departamentos = obj.departamentos.map((e:any) => {                
                
                e.empleado = e.empleado.filter((t: any) => { return t.timbres.length > 0 })
                return e

            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay atrasos de empleados en ese periodo'})

        return res.status(200).jsonp(datos)
    }

    public async ReportePuntualidad(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body;
        let params_query = req.query
        // console.log(params_query);        
        let n = await Promise.all(datos.map(async(obj:IReportePuntualidad) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o) => {
                        o.contrato = await pool.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato})
                        o.cargo = await pool.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo})
                        let timbres = await BuscarTimbresEoSReporte(desde, hasta, o.codigo);
                        // console.log('Return del timbre: ',timbres);
                        if (timbres.length === 0) {
                            o.puntualidad = 0;
                        } else {
                            let aux = await Promise.all(timbres.map(async(e) => {
                                return await ModelarPuntualidad(e);
                            }))
                            var array: any = [];
                            aux.forEach(u => {
                                if (u[0] > 0) {
                                    array.push(u[0])
                                }
                            })
                            o.puntualidad = parseInt(SumarValoresArray(array));
                            // console.log(o);
                        }

                        if (o.puntualidad >= parseInt(params_query.mayor)) {
                            o.color = '#06F313' // verde
                        } else if (o.puntualidad <= parseInt(params_query.menor)) {
                            o.color = '#EC2E05' // rojo
                        } else {
                            o.color = '#F38306' // naranja
                        }
                        return o})
                    )
                return ele})
                )
            return obj})
        )
        return res.status(200).jsonp(n)
    }

    public async ReporteTimbresIncompletos(req: Request, res: Response) {

        let {desde, hasta} = req.params
        console.log(desde, hasta);
        let datos: any[] = req.body
        console.log(datos);
        let n = await Promise.all(datos.map(async(obj:IReporteTimbres) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o) => {
                        o.contrato = await pool.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato})
                        o.cargo = await pool.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo})
                        o.timbres = await TimbresIncompletos( new Date(desde), new Date(hasta), o.codigo)
                        // console.log(o);
                        return o})
                    )
                return ele})
                )
            return obj})
        )

        let nuevo = n.map((obj: any) => {
            obj.departamentos = obj.departamentos.map((e:any) => {                
                e.empleado = e.empleado.filter((t: any) => { return t.timbres.length > 0 })
                return e
            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj
        }).filter(obj => { return obj.departamentos.length > 0 })
        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay atrasos de empleados en ese periodo'})
        return res.status(200).jsonp(nuevo)
    }

    public async ReporteTimbresTabulado(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body
        // console.log(datos);
        let n = await Promise.all(datos.map(async(obj:IReporteTimbres) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o) => {
                        o.contrato = await pool.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato})
                        o.cargo = await pool.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo})
                        o.timbres = await TimbresTabulados(desde, hasta, o.codigo)
                        return o})
                    )
                return ele})
                )
            return obj})
        )

        let nuevo = n.map((obj: any) => {
            obj.departamentos = obj.departamentos.map((e:any) => {                
                e.empleado = e.empleado.filter((t: any) => { return t.timbres.length > 0 })
                return e
            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj
        }).filter(obj => { return obj.departamentos.length > 0 });

        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay atrasos de empleados en ese periodo'})
        return res.status(200).jsonp(nuevo)
    }

    public async ReporteTimbresMultiple(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body
        console.log(datos);
        let n = await Promise.all(datos.map(async(obj:IReporteTimbres) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async(ele) => {
                ele.empleado = await Promise.all( ele.empleado.map(async(o) => {
                        o.timbres = await BuscarTimbres(desde, hasta, o.codigo);
                        console.log(o);
                        return o})
                    )
                return ele})
                )
            return obj})
        )

        let nuevo = n.map((obj: IReporteTimbres) => {

            obj.departamentos = obj.departamentos.map((e) => {                

                e.empleado = e.empleado.filter((t: any) => { return t.timbres.length > 0 })
                    // console.log('Empleados: ',e);
                return e

            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay atrasos de empleados en ese periodo'})

        return res.status(200).jsonp(nuevo)
    }

}

const REPORTE_A_CONTROLADOR = new ReportesAsistenciaControlador();
export default REPORTE_A_CONTROLADOR  

const BuscarTimbresEoSReporte = async function (fec_inicio: string, fec_final: string, codigo: string | number) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion = $3 AND id_empleado = $4 ORDER BY fec_hora_timbre ASC ',[ fec_inicio, fec_final, 'EoS', codigo])
        .then(res => {
            return res.rows;
        })
}

const BuscarTimbres = async function (fec_inicio: string, fec_final: string, codigo: string | number) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_reloj, accion, observacion, latitud, longitud FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND id_empleado = $3 ORDER BY fec_hora_timbre ASC ',[ fec_inicio, fec_final, codigo])
        .then(res => {
            return res.rows;
        })
}

const ModelarAtrasosReporte = async function (obj: any) {
    
    let array = await pool.query('SELECT dh.hora, dh.minu_espera FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND eh.fec_inicio <= $2 ' + 
    'AND eh.fec_final >= $2 AND dh.orden = 1',[obj.id_empleado, new Date(obj.fec_hora_timbre.split(' ')[0])])
    .then(res => { return res.rows})
    // let array = await pool.query('SELECT dh.hora, dh.minu_espera FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    // 'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
    // 'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden = 1 limit 1',[obj.id_empleado, fec_inicio, fec_final])
    // .then(res => { return res.rows})

    if (array.length === 0) return 0 
    console.log('Hora entrada y minuto Atrasos',array);
    return array.map(ele => {
        let retraso: boolean = false;
        var timbre = HHMMtoSegundos(obj.fec_hora_timbre.split(' ')[1])
        var hora_seg = HHMMtoSegundos(ele.hora) + ele.minu_espera*60;
        console.log('Timbre: ',timbre, hora_seg);
        
        (timbre > hora_seg ) ? retraso = true : retraso = false;
        if (retraso === false) return 0;
        let diferencia = (timbre - hora_seg) / 3600;
        if (diferencia > 4) return 0

        return {
            fecha: DiaSemana(new Date(obj.fec_hora_timbre.split(' ')[0])) + ' ' + obj.fec_hora_timbre.split(' ')[0],
            horario: ele.hora,
            timbre: obj.fec_hora_timbre.split(' ')[1],
            atraso_dec: diferencia.toFixed(2),
            atraso_HHMM: SegundosToHHMM(timbre - hora_seg),
        }
    })[0]
}

function DiaSemana(dia: Date) {
    let dias = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    // console.log('Dia seleccionado:', dias[dia.getUTCDay()], dia.getUTCDay());
    return dias[dia.getUTCDay()]
}

const BuscarTimbresReporte = async function (fecha: string, codigo: number) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), accion, observacion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 AND accion in (\'EoS\',\'AES\') ORDER BY fec_hora_timbre ASC ',[ fecha, codigo])
        .then(res => {
            return res.rows;
        })
}

const ModelarHorasTrabajaReporte = async function (codigo: number, fec_inicio: string, fec_final: string): Promise<any[]> {
    
    let array = await pool.query('SELECT DISTINCT dh.hora, dh.orden FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
    'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ',[codigo, fec_inicio, fec_final])
    .then(res => { return res.rows})

    if (array.length === 0) return []
    // console.log('horarios: ',array);

    var fec_aux = new Date(fec_inicio)
    var fecha1 = moment(fec_inicio);
    var fecha2 = moment(fec_final);

    var diasDiferencia = fecha2.diff(fecha1, 'days');
    let respuesta: Array<any> = [];
    for (let i = 0; i <= diasDiferencia; i++) {
        let horario_res = {
            fecha: fec_aux.toJSON().split('T')[0],
            timbres: await BuscarTimbresReporte(fec_aux.toJSON().split('T')[0], codigo),
            horario: array
        }
        if (horario_res.timbres.length > 0) {
            respuesta.push(horario_res)
        }
        fec_aux.setDate(fec_aux.getDate() + 1)
    }

    let arr_respuesta: Array<any> = [];

    respuesta.forEach((o: any) => {
        let obj = {
            fecha: o.fecha,
            horarios: [],
            total_timbres: '',
            total_horario: '',
            total_diferencia: '',
        } as IHorarioTrabajo;

        let arr_EoS: Array<any> = [];
        let arr_AES: Array<any> = [];
        let arr_horario_EoS: Array<any> = [];
        let arr_horario_AES: Array<any> = [];

        o.horario.forEach((h: any) => {
            let obj2 = {
                hora_horario: h.hora,
                hora_diferencia: '',
                hora_timbre: '',
                accion: '',
                observacion: ''
            }
            let diferencia = 0;
            let dif = 0;
            switch (h.orden) {
                case 1:
                    var arr3 = o.timbres.filter((t: any) => { return t.accion === 'EoS'})
                    if (arr3.length === 0) {
                        obj2.accion = 'EoS';
                        obj2.hora_timbre = h.hora;
                        obj2.observacion = 'Entrada';
                        dif = HHMMtoSegundos(h.hora) - HHMMtoSegundos(obj2.hora_timbre);
                    } else {
                        obj2.accion = arr3[0].accion;
                        obj2.observacion = arr3[0].observacion;
                        obj2.hora_timbre = arr3[0].fec_hora_timbre.split(' ')[1];
                        dif = HHMMtoSegundos(h.hora) - HHMMtoSegundos(obj2.hora_timbre);
                    }

                    diferencia = (dif < 0) ? dif * (-1) : dif;
                    obj2.hora_diferencia = (dif < 0) ? '-' + SegundosToHHMM(diferencia) : SegundosToHHMM(diferencia);

                    arr_horario_EoS.push(HHMMtoSegundos(obj2.hora_horario) )
                    arr_EoS.push(HHMMtoSegundos(obj2.hora_timbre) );
                    break;
                case 2:
                    var arr4 = o.timbres.filter((t: any) => { return t.accion === 'AES'})
                    if (arr4.length === 0) {
                        obj2.accion = 'AES';
                        obj2.hora_timbre = h.hora;
                        obj2.observacion = 'Salida Almuerzo';
                        dif = HHMMtoSegundos(obj2.hora_timbre) - HHMMtoSegundos(h.hora);
                    } else {
                        obj2.accion = arr4[0].accion;
                        obj2.observacion = arr4[0].observacion;
                        obj2.hora_timbre = arr4[0].fec_hora_timbre.split(' ')[1];
                        dif = HHMMtoSegundos(obj2.hora_timbre) - HHMMtoSegundos(h.hora);
                    }

                    diferencia = (dif < 0) ? dif * (-1) : dif;
                    obj2.hora_diferencia = (dif < 0) ? '-' + SegundosToHHMM(diferencia) : SegundosToHHMM(diferencia);

                    arr_horario_AES.push(HHMMtoSegundos(obj2.hora_horario))
                    arr_AES.push(HHMMtoSegundos(obj2.hora_timbre) );
                    break;
                case 3:
                    var arr1 = o.timbres.filter((t: any) => { return t.accion === 'AES'})
                    if (arr1.length === 0) {
                        obj2.accion = 'AES';
                        obj2.hora_timbre = h.hora;
                        obj2.observacion = 'Entrada Almuerzo';
                        dif = HHMMtoSegundos(h.hora) - HHMMtoSegundos(obj2.hora_timbre);
                    } else {
                        obj2.accion = arr1[arr1.length - 1].accion;
                        obj2.observacion = arr1[arr1.length - 1].observacion;
                        obj2.hora_timbre = arr1[arr1.length - 1].fec_hora_timbre.split(' ')[1];
                        dif = HHMMtoSegundos(h.hora) - HHMMtoSegundos(obj2.hora_timbre);
                    }
                    
                    diferencia = (dif < 0) ? dif * (-1) : dif;
                    obj2.hora_diferencia = (dif < 0) ? '-' + SegundosToHHMM(diferencia) : SegundosToHHMM(diferencia);

                    arr_horario_AES.push(HHMMtoSegundos(obj2.hora_horario))
                    arr_AES.push(HHMMtoSegundos(obj2.hora_timbre));
                    break;
                case 4:
                    var arr2 = o.timbres.filter((t: any) => { return t.accion === 'EoS'})
                    if (arr2.length === 0) {
                        obj2.accion = 'EoS';
                        obj2.hora_timbre = h.hora;
                        obj2.observacion = 'Salida';
                        dif = HHMMtoSegundos(obj2.hora_timbre) - HHMMtoSegundos(h.hora);
                    } else {
                        obj2.accion = arr2[arr2.length - 1].accion;
                        obj2.observacion = arr2[arr2.length - 1].observacion;
                        obj2.hora_timbre = arr2[arr2.length - 1].fec_hora_timbre.split(' ')[1];
                        dif = HHMMtoSegundos(obj2.hora_timbre) - HHMMtoSegundos(h.hora);
                    }

                    diferencia = (dif < 0) ? dif * (-1) : dif;
                    obj2.hora_diferencia = (dif < 0) ? '-' + SegundosToHHMM(diferencia) : SegundosToHHMM(diferencia);

                    arr_horario_EoS.push(HHMMtoSegundos(obj2.hora_horario))
                    arr_EoS.push(HHMMtoSegundos(obj2.hora_timbre));
                    break;
                default:
                    break;
            }

            obj.horarios.push(obj2)
        });

        var resta_hor_EoS  = parseFloat(arr_horario_EoS[1]) - parseFloat(arr_horario_EoS[0])
        var resta_hor_AES  = parseFloat(arr_horario_AES[1]) - parseFloat(arr_horario_AES[0])
        let resta_hor = resta_hor_EoS - resta_hor_AES;
        obj.total_horario = SegundosToHHMM(resta_hor);

        let resta_tim_EoS = parseFloat(arr_EoS[1]) - parseFloat(arr_EoS[0])
        let resta_tim_AES = parseFloat(arr_AES[1]) - parseFloat(arr_AES[0])
        let resta_tim = resta_tim_EoS - resta_tim_AES;
        obj.total_timbres = SegundosToHHMM(resta_tim);

        let dif_total = resta_tim - resta_hor;
        let diferencia_Total = 0;

        diferencia_Total = (dif_total < 0) ? dif_total * (-1) : dif_total;
        obj.total_diferencia = (dif_total < 0) ?  '-' + SegundosToHHMM(diferencia_Total) : SegundosToHHMM(diferencia_Total);
        
        arr_respuesta.push(obj)
    })

    respuesta = [];
    array = [];

    arr_respuesta.forEach((o: any) => {
        console.log('***************************');
        console.log(o);
        console.log('***************************');
    })
    
    return arr_respuesta

}

function SegundosToHHMM(dato: number) {
    // console.log('Hora decimal a HHMM ======>',dato);
    var h = Math.floor( dato / 3600 );  
    var m = Math.floor( (dato % 3600) / 60 );
    var s = dato % 60;
    if (h <= -1) {
        return '00:00:00'
    }
    let hora = (h >= 10) ?  h : '0' + h; 
    let min = (m >= 10) ? m : '0' + m;
    let seg = (s >= 10) ? s : '0' + s;

    return hora + ':' + min + ':' + seg
}

async function BuscarHorarioEmpleado(fec_inicio: string, fec_final: string, codigo: string | number) {
    let res = await pool.query('SELECT * FROM empl_horarios WHERE CAST(fec_inicio as VARCHAR) between $1 and $2 AND CAST(fec_final as VARCHAR) between $1 and $2 ' +
    'AND codigo = $3 ORDER BY fec_inicio',[fec_inicio, fec_final, codigo]).then(result => { return result.rows });

    if (res.length === 0) return res
    let array: Array<any> = [];
    res.forEach(obj => {
        HorariosParaInasistencias(obj).forEach(o => {
            array.push(o)
        })
        
    });

    let timbres = await Promise.all(array.map(async(o: any) => {
        o.registros = await pool.query('SELECT count(*) FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' ', [o.fecha])
            .then(result => { 
                if (result.rowCount === 0) return parseInt('0')
                
                return parseInt(result.rows[0].count)
            })
        return o
    }));

    return timbres
}

const ModelarPuntualidad = async function (obj: any): Promise<any[]> {
    
    let array = await pool.query('SELECT DISTINCT eh.id, dh.hora FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND eh.fec_inicio <= $2 ' + 
    'AND eh.fec_final >= $2 AND dh.orden = 1',[obj.id_empleado, new Date(obj.fec_hora_timbre.split(' ')[0])])
    .then(res => { return res.rows})

    if (array.length === 0) return [ 0 ]
    // console.log('Hora entrada',array);
    return array.map(ele => {
        let puntual: boolean = false;
        var timbre = HHMMtoSegundos(obj.fec_hora_timbre.split(' ')[1]) / 3600
        var hora = HHMMtoSegundos(ele.hora) / 3600;

        (timbre <=  hora ) ? puntual = true : puntual = false;
        if (puntual === false) return 0;
        let diferencia = hora - timbre;
        if (diferencia > 4) return 0 // para diferenciar las horas de salida

        return 1 // un dia puntual
    })
}

const TimbresTabulados = async function (fec_inicio: string, fec_final: string, codigo: string | number): Promise<any[]> {
    
    let timbres = await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), accion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND id_empleado = $3 ORDER BY fec_hora_timbre ASC ',[ fec_inicio, fec_final, codigo])
    .then(res => {
        return res.rows;
    })

    if (timbres.length === 0) return []

    var nuevoArray: any = []
	var arrayTemporal: any = []
	for(var i=0; i<timbres.length; i++){
	    arrayTemporal = nuevoArray.filter((res:any) => {
            return res["Fecha"] == timbres[i]["fec_hora_timbre"].split(' ')[0]
        });
	    if(arrayTemporal.length>0){
	        nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["Timbres"].push(timbres[i])
	    }else{
	        nuevoArray.push({"Fecha" : timbres[i]["fec_hora_timbre"].split(' ')[0] , "Timbres" : [timbres[i]]})
	    }
	}

    function compare(a: any, b: any) {
        var uno = new Date(a.Fecha);
        var dos = new Date(b.Fecha);
        if (uno < dos) return -1;
        if (uno > dos) return 1;
        return 0;
    }

    nuevoArray.sort(compare);
    let arrayModelado: any = [];
    nuevoArray.forEach((obj:any) => { 
        let e = {
            fecha: obj.Fecha,
            entrada: obj.Timbres.filter((ele: any) => { return ele.accion === 'EoS' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
            salida: obj.Timbres.filter((ele: any) => { return ele.accion === 'EoS' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[1],
            sal_Alm: obj.Timbres.filter((ele: any) => { return ele.accion === 'AES' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
            ent_Alm: obj.Timbres.filter((ele: any) => { return ele.accion === 'AES' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[1],
            desconocido: obj.Timbres.filter((ele: any) => { return ele.accion != 'EoS' && ele.accion != 'AES' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0]
        } as tim_tabulado;
        // console.log(e); 
        arrayModelado.push(e)
    });

    return arrayModelado
} 

const TimbresIncompletos = async function (fec_inicio: Date, fec_final: Date, codigo: number): Promise<any[]> {
    
    let horarios = 
    await pool.query('SELECT eh.fec_inicio, eh.fec_final, eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo, eh.codigo ' + 
    'FROM empl_horarios AS eh WHERE eh.fec_inicio >= $1 AND eh.fec_final <= $2 AND eh.codigo = $3 ORDER BY eh.fec_inicio ASC',[fec_inicio, fec_final, codigo]).then(result => {
        return result.rows
    });

    if (horarios.length === 0) return [];

    let hora_deta = await Promise.all(horarios.map( async(obj: any) => {
        obj.dias_laborados = HorariosParaInasistencias(obj)
        // obj.dias_laborados = ModelarFechas(obj.fec_inicio, obj.fec_final, obj)
        obj.deta_horarios = await pool.query('SELECT DISTINCT dh.hora, dh.orden, dh.tipo_accion FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
        'WHERE eh.id_horarios = h.id AND h.id = dh.id_horario AND eh.codigo = $1 ORDER BY dh.orden ASC',
        [obj.codigo]).then(result => {
            return result.rows
        })
        return obj
    }));

    if (hora_deta.length === 0) return [];

    let modelado = await Promise.all(hora_deta.map(async(obj) => {
        obj.dias_laborados = await Promise.all(obj.dias_laborados.map(async(obj1: any) => {
            return {
                fecha: obj1.fecha,
                timbres_hora: await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR) AS timbre, accion FROM timbres WHERE id_empleado = $1 AND CAST(fec_hora_timbre AS VARCHAR) like $2 || \'%\' AND accion in (\'EoS\',\'AES\')',[obj.codigo, obj1.fecha]).then(result => { return result.rows})
            }
        }))
        obj.dias_laborados = obj.dias_laborados.map((o: any) => {
            if (o.timbres_hora.length === 0) {
                o.timbres_hora = obj.deta_horarios.map((h: any) => {
                    return {
                        tipo: h.tipo_accion,
                        hora: h.hora
                    }
                })
                return o;
            } else {
                o.timbres_hora = obj.deta_horarios.map((h:any) => {
                    var h_inicio = HHMMtoSegundos(h.hora) - HHMMtoSegundos('01:00:00')
                    var h_final = HHMMtoSegundos(h.hora) + HHMMtoSegundos('01:00:00')
                    let respuesta = o.timbres_hora.filter((t:any) => {
                        let hora_timbre = HHMMtoSegundos(t.timbre.split(' ')[1]) 
                        return h_inicio <= hora_timbre && h_final >= hora_timbre
                    })

                    // console.log('RESPUESTA TIMBRE ENCONTRADO: ', respuesta);
                    if (respuesta.length === 0) {
                        return {
                            tipo: h.tipo_accion,
                            hora: h.hora
                        }
                    }
                    return 0
                }).filter((h: any) => { return h != 0 })
                return o;
            }
        })

        return obj
    }))

    // modelado.forEach(obj => { console.log(obj.dias_laborados);})
    let res: any = [];  
    modelado.forEach(obj => {
        obj.dias_laborados.filter((o:any) => {
            return o.timbres_hora.length > 0
        }).map((o:any) => {
            res.push(o)
            return o
        })
    })
    
    return res
}

function ModelarFechas(desde: string, hasta: string, horario: any) {
    let fechasRango =  {
        inicio: desde,
        final: hasta
    };
    
    let objeto = DiasConEstado(horario, fechasRango);
    // console.log('Objeto JSON: ', objeto);
    return objeto.filter(obj => { return (obj.estado === false)}).map(obj => { return {fecha: obj.fecha}})
}

function DiasConEstado(horario: any, rango: any) {
    var fec_aux = new Date(rango.inicio)
    var fecha1 = moment(rango.inicio);
    var fecha2 = moment(rango.final);

    var diasHorario = fecha2.diff(fecha1, 'days');
    let respuesta = [];
    for (let i = 0; i <= diasHorario; i++) {
        let horario_res =  fechaIterada(fec_aux, horario);
        respuesta.push(horario_res)
        fec_aux.setDate(fec_aux.getDate() + 1)
    }
    return respuesta
}

function fechaIterada(fechaIterada: Date, horario: any){
    let est;
    if (fechaIterada.getDay() === 0) {
        est = horario.domingo
    } else if (fechaIterada.getDay() === 1) {
        est = horario.lunes
    } else if (fechaIterada.getDay() === 2) {
        est = horario.martes
    } else if (fechaIterada.getDay() === 3) {
        est = horario.miercoles
    } else if (fechaIterada.getDay() === 4) {
        est = horario.jueves
    } else if (fechaIterada.getDay() === 5) {
        est = horario.viernes
    } else if (fechaIterada.getDay() === 6) {
        est = horario.sabado
    } 

    return {
        fecha: fechaIterada.toJSON().split('T')[0],
        estado: est
    }
}