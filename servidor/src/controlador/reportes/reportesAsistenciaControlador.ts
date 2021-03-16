import { Request, Response } from 'express'
import { dep, emp, IHorarioTrabajo, IReporteAtrasos, IReportePuntualidad, IReporteTimbres, tim_tabulado } from '../../class/Asistencia';
import pool from '../../database'
import { HHMMtoSegundos, SumarValoresArray } from '../../libs/SubMetodosGraficas';
import { HorariosParaInasistencias } from '../../libs/MetodosHorario'
import moment from 'moment';

class ReportesAsistenciaControlador {

    /**
     * Realiza un array de sucursales con departamentos y empleados dependiendo del estado del empleado si busca empleados activos o inactivos. 
     * @returns Retorna Array de [Sucursales[Departamentos[empleados[]]]]
     */
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
        
        return res.status(200).jsonp(respuesta)
    }

    /**
     * Función que calcula el tiempo de atraso según el timbre realizado por el o los empleados. 
     * @returns Retorna un JSON con la informacion de los empleados atrasados en dias laborables.
     */
    public async ReporteAtrasosMultiple(req: Request, res: Response) {

        let {desde, hasta} = req.params;
        // console.log(desde, hasta);
        let datos: any[] = req.body;
        let n: Array<any> = [];
        //false sin acciones || true con acciones
        if (req.acciones_timbres === true) {
            // Resultados de timbres con 6 y 3 acciones

            n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
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

        } else {
            // Resultados de timbres sin acciones
            n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
                obj.departamentos = await Promise.all(obj.departamentos.map(async(ele:dep) => {
                    ele.empleado = await Promise.all( ele.empleado.map(async(o:emp) => {
                        
                            o.timbres = await AtrasosTimbresSinAccion(desde, hasta, o.codigo);
                            // console.log(o);
                            return o})
                        )
                    return ele})
                    )
                return obj})
            )
        }

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

        return res.status(200).jsonp(nuevo);
        
    }

    /**
     * Función que devuelve los dias que el empleado falto a laborar según su horario.
     * @returns Retorna un JSON con la informacion de los empleados que an faltado a laborar.
     */
    public async ReporteFaltasMultiple(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body
        let n: Array<any> = [];
        //El reporte funciona para relojs de 6, 3 y sin acciones.        

        n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
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
        //El reporte funciona para relojs de 6, 3 y sin acciones.

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
        // console.log(desde, hasta);
        let datos: any[] = req.body
        // console.log(datos);

        let n: Array<any> = [];
        //false sin acciones || true con acciones
        if (req.acciones_timbres === true) {
            // Resultados de timbres con 6 y 3 acciones

            n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
                obj.departamentos = await Promise.all(obj.departamentos.map(async(ele:dep) => {
                    ele.empleado = await Promise.all( ele.empleado.map(async(o:emp) => {                        
                            o.timbres = await ModelarHorasTrabajaReporte(o.codigo, desde, hasta);
                            return o})
                        )
                    return ele})
                    )
                return obj})
            )

        } else {
            // Resultados de timbres sin acciones
            console.log('LLEGO A TIMBRES SIN ACCIONES');
            
            n = await Promise.all(datos.map(async(obj:IReporteAtrasos) => {
                obj.departamentos = await Promise.all(obj.departamentos.map(async(ele:dep) => {
                    ele.empleado = await Promise.all( ele.empleado.map(async(o:emp) => {                        
                            o.timbres = await ModelarHorasTrabajaTimbresSinAcciones(o.codigo, desde, hasta);
                            return o})
                        )
                    return ele})
                    )
                return obj})
            )

        }
       
        let nuevo = n.map((obj: any) => {
    
            obj.departamentos = obj.departamentos.map((e:any) => {                
                
                e.empleado = e.empleado.filter((t: any) => { return t.timbres.length > 0 })
                return e

            }).filter((e: any) => { return e.empleado.length > 0 }) 
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({message: 'No hay timbres de empleados en ese periodo'})

        return res.status(200).jsonp(datos)
    }

    public async ReportePuntualidad(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body;
        let params_query = req.query
        // console.log(params_query);  
        
        //false sin acciones || true con acciones
        if (req.acciones_timbres === true) {
            // Resultados de timbres con 6 y 3 acciones

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

        } else {
            // Resultados de timbres sin acciones

            return res.status(400).jsonp({message: 'Resultado de timbres sin acciones'});

        }
        
    }

    public async ReporteTimbresIncompletos(req: Request, res: Response) {

        let {desde, hasta} = req.params
        console.log(desde, hasta);
        let datos: any[] = req.body
        console.log(datos);

        //false sin acciones || true con acciones
        if (req.acciones_timbres === true) {
            // Resultados de timbres con 6 y 3 acciones

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

        } else {
            // Resultados de timbres sin acciones

            return res.status(400).jsonp({message: 'Resultado de timbres sin acciones'});

        }
        
    }

    public async ReporteTimbresTabulado(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body
        // console.log(datos);

        //false sin acciones || true con acciones
        if (req.acciones_timbres === true) {
            // Resultados de timbres con 6 y 3 acciones

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

        } else {
            // Resultados de timbres sin acciones

            return res.status(400).jsonp({message: 'Resultado de timbres sin acciones'});

        }
        
    }

    public async ReporteTimbresMultiple(req: Request, res: Response) {

        let {desde, hasta} = req.params
        // console.log(desde, hasta);
        let datos: any[] = req.body
        console.log(datos);

        //false sin acciones || true con acciones
        if (req.acciones_timbres === true) {
            // Resultados de timbres con 6 y 3 acciones

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

        } else {
            // Resultados de timbres sin acciones

            return res.status(400).jsonp({message: 'Resultado de timbres sin acciones'});

        }
        
    }

}

const REPORTE_A_CONTROLADOR = new ReportesAsistenciaControlador();
export default REPORTE_A_CONTROLADOR  

const AtrasosTimbresSinAccion = async function (fec_inicio: string, fec_final: string, codigo: string | number): Promise<any> {
    const orden = 1;
    // console.log('ATRASOS - TIMBRES SIN ACCION: ', fec_inicio, fec_final, codigo );
    let horarioEntrada = await pool.query('SELECT dt.hora, dt.minu_espera, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR), '+
    'eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo ' +
    'FROM empl_horarios AS eh, cg_horarios AS ch, deta_horarios AS dt '+ 
    'WHERE dt.orden = $1 AND eh.fec_inicio BETWEEN $2 AND $3 AND eh.fec_final BETWEEN $2 AND $3 AND eh.codigo = $4 ' + 
    'AND eh.id_horarios = ch.id AND ch.id = dt.id_horario',[orden, new Date(fec_inicio), new Date(fec_final), codigo])
    .then(result => { return result.rows })

    if (horarioEntrada.length === 0) return [0];

    let nuevo: Array<any> = [];

    let aux = await Promise.all(horarioEntrada.map(async(obj)=> {
        let fechas = ModelarFechas(obj.fec_inicio, obj.fec_final, obj);
        let timbres = await Promise.all(fechas.map(async(o) => {
            var hora_seg = HHMMtoSegundos(obj.hora) + (obj.minu_espera * 60);
            var f_inicio = o.fecha + ' ' + SegundosToHHMM(hora_seg);
            var f_final = o.fecha + ' ' + SegundosToHHMM( hora_seg + HHMMtoSegundos('02:00:00') );
            // console.log( f_inicio, ' || ', f_final, ' || ', codigo);
            const query = 'select CAST(fec_hora_timbre AS VARCHAR), id_empleado from timbres where fec_hora_timbre >= TO_TIMESTAMP(\'' + f_inicio + '\'' + ', \'YYYY-MM-DD HH:MI:SS\') ' +
                    'and fec_hora_timbre <= TO_TIMESTAMP(\'' + f_final + '\'' + ', \'YYYY-MM-DD HH:MI:SS\') and id_empleado = ' + codigo +' order by fec_hora_timbre'
            // console.log(query);
            
            return await pool.query(query)
            .then(res => { 
                if (res.rowCount === 0) {
                    return 0
                } else {
                    const f_timbre = res.rows[0].fec_hora_timbre.split(' ')[0];
                    const h_timbre = res.rows[0].fec_hora_timbre.split(' ')[1];
                    const t_tim = HHMMtoSegundos(h_timbre);
                    let diferencia = (t_tim - hora_seg) / 3600;
                    return {
                        fecha: DiaSemana(new Date(f_timbre)) + ' ' + f_timbre,
                        horario: obj.hora,
                        timbre: h_timbre,
                        atraso_dec: diferencia.toFixed(2),
                        atraso_HHMM: SegundosToHHMM(t_tim - hora_seg),
                    };                    
                }
            })
        }));

        return timbres
    }))
    

    aux.forEach(obj => {
        if (obj.length > 0) {
            obj.forEach(o => {
                if (o !== 0) {
                    nuevo.push(o)
                }
            })
        }
    })
    // console.log('Este es el resul: ',nuevo);
    return nuevo
}

const BuscarTimbresEoSReporte = async function (fec_inicio: string, fec_final: string, codigo: string | number) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion in (\'EoS\', \'E\') AND id_empleado = $3 ORDER BY fec_hora_timbre ASC ',[ fec_inicio, fec_final, codigo])
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

    if (array.length === 0) return 0 
    console.log('Hora entrada y minuto Atrasos',array);
    return array.map(ele => {
        let retraso: boolean = false;
        var timbre = HHMMtoSegundos(obj.fec_hora_timbre.split(' ')[1])
        var hora_seg = HHMMtoSegundos(ele.hora) + ele.minu_espera*60;
        console.log('Timbre: ',timbre, hora_seg);
        
        retraso = (timbre > hora_seg ) ? true : false;
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
    return dias[dia.getUTCDay()]
}

const BuscarTimbresReporte = async function (fecha: string, codigo: number) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), accion, observacion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 AND accion in (\'EoS\',\'AES\',\'S\',\'E\',\'E/A\',\'S/A\') ORDER BY fec_hora_timbre ASC ',[ fecha, codigo])
        .then(res => {
            return res.rows;
        })
}

const BuscarTimbresSinAccionesReporte = async function (fecha: string, codigo: number) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), observacion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 ORDER BY fec_hora_timbre ASC ',[ fecha, codigo])
        .then(res => {
            return res.rows;
        })
}

const ModelarHorasTrabajaReporte = async function (codigo: number, fec_inicio: string, fec_final: string): Promise<any[]> {
    console.log(codigo, fec_inicio ,fec_final);
    
    let array = await pool.query('SELECT dh.hora, dh.orden, dh.id_horario, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR) FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
    'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ORDER BY eh.fec_inicio',[codigo, fec_inicio, fec_final])
    .then(res => { return res.rows})

    if (array.length === 0) return []
    console.log('ARRAY MODELAR HORAS TRABAJADAS: ',array);
    
    var nuevoArray: any = []
	var arrayTemporal: any = []
	for(var i = 0; i < array.length; i++){
	    arrayTemporal = nuevoArray.filter((res:any) => {
            return res["Fecha"] == array[i]["fec_inicio"] + ' ' + array[i]["fec_final"]
        });
	    if(arrayTemporal.length>0){
	        nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["Horario"].push(array[i])
	    }else{
	        nuevoArray.push({"Fecha" : array[i]["fec_inicio"]  + ' ' + array[i]["fec_final"] , "Horario" : [ array[i] ]})
	    }
	}

    nuevoArray.sort(compareFechas);

    let res_timbre: any = await Promise.all(nuevoArray.map(async(obj:any) => {
        var fec_aux = new Date(obj.Fecha.split(' ')[0])
        var fecha1 = moment(obj.Fecha.split(' ')[0]);
        var fecha2 = moment(obj.Fecha.split(' ')[1]);
        var diasDiferencia = fecha2.diff(fecha1, 'days');

        let res: Array<any> = [];
        for (let i = 0; i <= diasDiferencia; i++) {
            let horario_res = {
                fecha: fec_aux.toJSON().split('T')[0],
                timbres: await BuscarTimbresReporte(fec_aux.toJSON().split('T')[0], codigo),
                horario: obj.Horario.sort(compareOrden)
            }
            if (horario_res.timbres.length > 0) {
                res.push(horario_res)
            }
            fec_aux.setDate(fec_aux.getDate() + 1)
        }
        
        return res
    }))

    let respuesta = res_timbre.filter((obj:any) => {
        return obj.length > 0
    })

    let arr_respuesta: Array<any> = [];

    respuesta.forEach((arr: any) => {
        arr.forEach((o:any) => {
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
                        var arr3 = o.timbres.filter((t: any) => { return t.accion === 'EoS' || t.accion === 'E'})
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
                        var arr4 = o.timbres.filter((t: any) => { return t.accion === 'AES' || t.accion === 'S/A'})
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
                        var arr1 = o.timbres.filter((t: any) => { return t.accion === 'AES' || t.accion === 'E/A'})
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
                        var arr2 = o.timbres.filter((t: any) => { return t.accion === 'EoS' || t.accion === 'S'})
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
        });
    })

    nuevoArray = [];
    res_timbre = [];
    respuesta = [];
    array = [];
    
    return arr_respuesta
}

const ModelarHorasTrabajaTimbresSinAcciones = async function (codigo: number, fec_inicio: string, fec_final: string): Promise<any[]> {

    let array = await pool.query('SELECT dh.hora, dh.orden, dh.id_horario, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR) FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
    'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ORDER BY eh.fec_inicio',[codigo, fec_inicio, fec_final])
    .then(res => { return res.rows})

    if (array.length === 0) return []
    // console.log('ARRAY MODELAR HORAS TRABAJADAS: ',array);
    
    var nuevoArray: any = []
	var arrayTemporal: any = []
	for(var i = 0; i < array.length; i++){
	    arrayTemporal = nuevoArray.filter((res:any) => {
            return res["Fecha"] == array[i]["fec_inicio"] + ' ' + array[i]["fec_final"]
        });
	    if(arrayTemporal.length>0){
	        nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["Horario"].push(array[i])
	    }else{
	        nuevoArray.push({"Fecha" : array[i]["fec_inicio"]  + ' ' + array[i]["fec_final"] , "Horario" : [ array[i] ]})
	    }
	}

    nuevoArray.sort(compareFechas);

    let res_timbre: any = await Promise.all(nuevoArray.map(async(obj:any) => {
        var fec_aux = new Date(obj.Fecha.split(' ')[0])
        var fecha1 = moment(obj.Fecha.split(' ')[0]);
        var fecha2 = moment(obj.Fecha.split(' ')[1]);
        var diasDiferencia = fecha2.diff(fecha1, 'days');

        let res: Array<any> = [];
        for (let i = 0; i <= diasDiferencia; i++) {
            let horario_res = {
                fecha: fec_aux.toJSON().split('T')[0],
                timbres: await BuscarTimbresSinAccionesReporte(fec_aux.toJSON().split('T')[0], codigo),
                horario: obj.Horario.sort(compareOrden)
            }
            if (horario_res.timbres.length > 0) {
                res.push(horario_res)
            }
            fec_aux.setDate(fec_aux.getDate() + 1)
        }
        
        return res
    }))

    let respuesta = res_timbre.filter((obj:any) => {        
        return obj.length > 0
    })
    // console.log('Respuesta timbres sin acciones:',respuesta);
    let arr_respuesta: Array<any> = [];

    respuesta.forEach((arr: any) => {
        arr.forEach((o:any) => {
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
            o.timbres.forEach((element:any) => {
                console.log(element);                
            });
            
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
                        var arr3 = o.timbres.filter((t: any) => { 
                            const hora_timbre = HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                            const h_inicio = HHMMtoSegundos(h.hora) - HHMMtoSegundos('01:30:00');
                            const h_final = HHMMtoSegundos(h.hora) + HHMMtoSegundos('01:59:00');
                            return (h_inicio <= hora_timbre && h_final >= hora_timbre)
                        })

                        obj2.hora_timbre = (arr3.length === 0) ? h.hora : arr3[0].fec_hora_timbre.split(' ')[1];
                        obj2.observacion = (arr3.length === 0) ? 'Entrada': arr3[0].observacion;
                        obj2.accion = 'EoS';
                        dif = HHMMtoSegundos(h.hora) - HHMMtoSegundos(obj2.hora_timbre);
    
                        diferencia = (dif < 0) ? dif * (-1) : dif;
                        obj2.hora_diferencia = (dif < 0) ? '-' + SegundosToHHMM(diferencia) : SegundosToHHMM(diferencia);
    
                        arr_horario_EoS.push(HHMMtoSegundos(obj2.hora_horario) )
                        arr_EoS.push(HHMMtoSegundos(obj2.hora_timbre) );
                        break;
                    case 2:
                        var arr4 = o.timbres.filter((t: any) => { 
                            const hora_timbre = HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                            const h_inicio = HHMMtoSegundos(h.hora) - HHMMtoSegundos('00:59:00');
                            const h_final = HHMMtoSegundos(h.hora) + HHMMtoSegundos('00:59:00');
                            return (h_inicio <= hora_timbre && h_final >= hora_timbre)
                        })
                        
                        obj2.hora_timbre = (arr4.length === 0) ? h.hora : arr4[0].fec_hora_timbre.split(' ')[1];
                        obj2.observacion = (arr4.length === 0) ? 'Salida Almuerzo': arr4[0].observacion;
                        obj2.accion = 'AES';
                        dif = HHMMtoSegundos(obj2.hora_timbre) - HHMMtoSegundos(h.hora);
    
                        diferencia = (dif < 0) ? dif * (-1) : dif;
                        obj2.hora_diferencia = (dif < 0) ? '-' + SegundosToHHMM(diferencia) : SegundosToHHMM(diferencia);
    
                        arr_horario_AES.push(HHMMtoSegundos(obj2.hora_horario))
                        arr_AES.push(HHMMtoSegundos(obj2.hora_timbre) );
                        break;
                    case 3:
                        var arr1 = o.timbres.filter((t: any) => { 
                            const hora_timbre = HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                            const h_inicio = HHMMtoSegundos(h.hora) - HHMMtoSegundos('00:59:00');
                            const h_final = HHMMtoSegundos(h.hora) + HHMMtoSegundos('00:59:00');
                            return (h_inicio <= hora_timbre && h_final >= hora_timbre)
                        })

                        obj2.hora_timbre = (arr1.length === 0) ? h.hora : arr1[0].fec_hora_timbre.split(' ')[1];
                        obj2.observacion = (arr1.length === 0) ? 'Entrada Almuerzo': arr1[0].observacion;
                        obj2.accion = 'AES';
                        dif = HHMMtoSegundos(h.hora) - HHMMtoSegundos(obj2.hora_timbre);
                        
                        diferencia = (dif < 0) ? dif * (-1) : dif;
                        obj2.hora_diferencia = (dif < 0) ? '-' + SegundosToHHMM(diferencia) : SegundosToHHMM(diferencia);
    
                        arr_horario_AES.push(HHMMtoSegundos(obj2.hora_horario))
                        arr_AES.push(HHMMtoSegundos(obj2.hora_timbre));
                        break;
                    case 4:
                        var arr2 = o.timbres.filter((t: any) => { 
                            const hora_timbre = HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                            const h_inicio = HHMMtoSegundos(h.hora) - HHMMtoSegundos('01:59:00');
                            const h_final = HHMMtoSegundos(h.hora) + HHMMtoSegundos('01:30:00');
                            return (h_inicio <= hora_timbre && h_final >= hora_timbre)
                        })

                        obj2.hora_timbre = (arr2.length === 0) ? h.hora : arr2[0].fec_hora_timbre.split(' ')[1];
                        obj2.observacion = (arr2.length === 0) ? 'Salida': arr2[0].observacion;
                        obj2.accion = 'EoS';
                        dif = HHMMtoSegundos(obj2.hora_timbre) - HHMMtoSegundos(h.hora);
    
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
        });
    })

    nuevoArray = [];
    res_timbre = [];
    respuesta = [];
    array = [];
    
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
    let res = await pool.query('SELECT * FROM empl_horarios WHERE fec_inicio between $1::timestamp and $2::timestamp AND fec_final between $1::timestamp and $2::timestamp ' +
    'AND codigo = $3 ORDER BY fec_inicio',[fec_inicio, fec_final, codigo]).then(result => { return result.rows });
    
    if (res.length === 0) return res
    let array: Array<any> = [];
    res.forEach(obj => {
        HorariosParaInasistencias(obj).forEach(o => {
            array.push(o)
        });
    });

    
    let timbres = await Promise.all(array.map(async(o: any) => {
        o.registros = await pool.query('SELECT count(*) FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' ', [o.fecha])
            .then(result => { 
                if (result.rowCount === 0) return 0
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
        console.log('NUEVO ARRAY TABULADO: ', obj);
        
        if (obj.Timbres[0].accion === 'EoS' || obj.Timbres[0].accion === 'AES' || obj.Timbres[0].accion === 'PES') {
            let e = {
                fecha: obj.Fecha,
                entrada: obj.Timbres.filter((ele: any) => { return ele.accion === 'EoS' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
                salida: obj.Timbres.filter((ele: any) => { return ele.accion === 'EoS' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[1],
                sal_Alm: obj.Timbres.filter((ele: any) => { return ele.accion === 'AES' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
                ent_Alm: obj.Timbres.filter((ele: any) => { return ele.accion === 'AES' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[1],
                desconocido: obj.Timbres.filter((ele: any) => { return ele.accion != 'EoS' && ele.accion != 'AES' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0]
            } as tim_tabulado;
            arrayModelado.push(e)
        } else {
            let e = {
                fecha: obj.Fecha,
                entrada: obj.Timbres.filter((ele: any) => { return ele.accion === 'E' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
                salida: obj.Timbres.filter((ele: any) => { return ele.accion === 'S' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
                sal_Alm: obj.Timbres.filter((ele: any) => { return ele.accion === 'S/A' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
                ent_Alm: obj.Timbres.filter((ele: any) => { return ele.accion === 'E/A'}).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0],
                desconocido: obj.Timbres.filter((ele: any) => { return ele.accion != 'E' && ele.accion != 'S' && ele.accion != 'S/A' && ele.accion != 'E/A' }).map((ele: any) => { return ele.fec_hora_timbre.split(' ')[1] })[0]
            } as tim_tabulado;
            arrayModelado.push(e)
        }
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
                timbres_hora: await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR) AS timbre, accion FROM timbres WHERE id_empleado = $1 AND CAST(fec_hora_timbre AS VARCHAR) like $2 || \'%\' AND accion in (\'EoS\',\'AES\', \'S\',\'E\',\'E/A\',\'S/A\')',[obj.codigo, obj1.fecha]).then(result => { return result.rows})
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

function ModelarFechas(desde: string, hasta: string, horario: any): Array<any> {
    let fechasRango =  {
        inicio: desde,
        final: hasta
    };
    
    let objeto = DiasConEstado(horario, fechasRango);
    // console.log('Objeto JSON: ', objeto);
    return objeto.filter(obj => { return (obj.estado === false)}).map(obj => { return {fecha: obj.fecha}})
}

/**
 * Mezcla el horario y las fechas para obtener los dias con su estado: TRUE=dia libre || FALSE=dia laborable
 * @param horario Es el horario del empleado
 * @param rango Rango de fecha de inicio y final 
 * @returns Un Array de objetos.
 */
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

/**
 * Funcion se utiliza en un Ciclo For de un rango de fechas.
 * @param fechaIterada Dia de un ciclo for
 * @param horario Es el horario del empleado
 * @returns Retorna objeto de fecha con su estado true si el dia es libre y false si el dia trabaja. 
 */
function fechaIterada(fechaIterada: Date, horario: any){
    let est;

    switch (fechaIterada.getDay()) {
        case 0: est = horario.domingo; break;
        case 1: est = horario.lunes; break;
        case 2: est = horario.martes; break;
        case 3: est = horario.miercoles; break;
        case 4: est = horario.jueves; break;
        case 5: est = horario.viernes; break;
        case 6: est = horario.sabado; break;
        default: break;
    }

    return {
        fecha: fechaIterada.toJSON().split('T')[0],
        estado: est
    }
}

function compareFechas(a: any, b: any) {
    var uno = new Date(a.Fecha);
    var dos = new Date(b.Fecha);
    if (uno < dos) return -1;
    if (uno > dos) return 1;
    return 0;
}
function compareOrden(a: any, b: any) {
    if (a.orden < b.orden) return -1;
    if (a.orden > b.orden) return 1;
    return 0;
}