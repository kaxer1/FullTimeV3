import pool from '../database';
import moment from 'moment';
import { IHorarioCodigo } from '../class/Model_graficas';
import { HorariosParaInasistencias } from './MetodosHorario'

export const BuscarTimbresByFecha = async function (fec_inicio: string, fec_final: string) {

    return await pool.query('SELECT fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' ORDER BY fec_hora_timbre ASC',[ fec_inicio, fec_final])
        .then(res => {
            return res.rows;
        })
}

export const BuscarHorariosActivos = async function (fec_inicio: string, fec_final: string) {
    
    let lista_horarios = await pool.query('SELECT * FROM empl_horarios WHERE CAST(fec_inicio AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' ORDER BY fec_inicio ASC',[ fec_inicio, fec_final])
        .then(res => {
            return res.rows;
        });
    
    let array = lista_horarios.map(obj => {
        return {
            horario: HorariosParaInasistencias(obj),
            codigo: obj.codigo
        } as IHorarioCodigo
    });

    lista_horarios = [];
    
    return array
}

export const BuscarTimbresByCodigo_Fecha = async function (codigo: number, horario: any[]) {

    return await Promise.all(horario.map(async(obj) => {
        return await pool.query('SELECT fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 ORDER BY fec_hora_timbre ASC',[ obj.fecha, codigo])
        .then(res => {
            return {
                fecha: obj.fecha,
                timbresTotal: res.rowCount
            };
        })
    }))
}

export const BuscarHorasExtras = async function (fec_inicio: string, fec_final: string) {

    return await pool.query('SELECT fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' ORDER BY fec_hora_timbre ASC',[ fec_inicio, fec_final])
        .then(res => {
            return res.rows;
        })
}

export const HoraExtra_ModelarDatos = async function(fec_desde: Date, fec_hasta: Date) {
    let horas_extras = await ListaHorasExtrasGrafica( fec_desde, fec_hasta)
    // console.log('Lista de horas extras ===', horas_extras);
    let array = horas_extras.map((obj:any) => {
        (obj.tiempo_autorizado === 0) ? obj.tiempo_autorizado = obj.num_hora : obj.tiempo_autorizado = obj.tiempo_autorizado; 
        return obj
    });
    // console.log('Lista de array ===', array);
    let nuevo: any = [];

    array.forEach(obj => {
        let respuesta = DiasIterados(obj.fec_inicio, obj.fec_final, obj.tiempo_autorizado, obj.id_empl_cargo, obj.codigo)
        respuesta.forEach(ele => {
            nuevo.push(ele);
        })
    });
    // console.log('Lista de Nuevo ===', nuevo);    

    return nuevo
}

function DiasIterados(inicio: string, final: string, tiempo_autorizado: number, id_empl_cargo: number, codigo: number) {
    var fec_aux = new Date(inicio)
    var fecha1 = moment(inicio.split("T")[0]);
    var fecha2 = moment(final.split("T")[0]);

    var diasHorario = fecha2.diff(fecha1, 'days') + 1;
    let respuesta = [];
    for (let i = 0; i < diasHorario; i++) {
        let horario_res = {
            fecha: fec_aux.toJSON().split('T')[0],
            tiempo: tiempo_autorizado,
            cargo: id_empl_cargo,
            codigo: codigo
        };
        // console.log(inicio,'--', final, diasHorario,'**************',horario_res);
        
        respuesta.push(horario_res)
        fec_aux.setDate(fec_aux.getDate() + 1)
    }
    return respuesta
}

async function ListaHorasExtrasGrafica(fec_desde: Date, fec_hasta: Date) {
    let arrayUno = await HorasExtrasSolicitadasGrafica(fec_desde, fec_hasta)
    let arrayDos = await PlanificacionHorasExtrasSolicitadasGrafica(fec_desde, fec_hasta)
    // let arrayUnido  = [...new Set(arrayUno.concat(arrayDos))];  
    let arrayUnido = arrayUno.concat(arrayDos)
    let set = new Set( arrayUnido.map(obj => { return JSON.stringify(obj)} ) )
    arrayUnido = Array.from( set ).map(obj => { return JSON.parse(obj)} );

    for (let j = 0; j < arrayUnido.length; j++) {
        let numMin;
        let i = numMin = j;
        for (++i; i < arrayUnido.length; i++) {
            (arrayUnido[i].fec_inicio < arrayUnido[numMin].fec_inicio) && (numMin = i);
        }
        [arrayUnido[j], arrayUnido[numMin]] = [arrayUnido[numMin], arrayUnido[j]]
    }

    return arrayUnido
}

async function HorasExtrasSolicitadasGrafica(fec_desde: Date, fec_hasta: Date) {
    return await pool.query('SELECT h.fec_inicio, h.fec_final, h.descripcion, h.num_hora, h.tiempo_autorizado, h.codigo, h.id_empl_cargo ' + 
    'FROM hora_extr_pedidos AS h WHERE h.fec_inicio between $1 and $2 AND h.estado = 3 ' +  // estado = 3 significa q las horas extras fueron autorizadas
    'AND h.fec_final between $1 and $2 ORDER BY h.fec_inicio',[fec_desde, fec_hasta])
    .then(result => { 
        return Promise.all(result.rows.map(async(obj) => {
            var f1 = new Date(obj.fec_inicio)
            var f2 = new Date(obj.fec_final)
            f1.setUTCHours(f1.getUTCHours() - 5);
            f2.setUTCHours(f2.getUTCHours() - 5);
            const hora_inicio = HHMMtoHorasDecimal(f1.toJSON().split('T')[1].split('.')[0]);
            const hora_final = HHMMtoHorasDecimal(f2.toJSON().split('T')[1].split('.')[0]);
            f1.setUTCHours(f1.getUTCHours() - 5);
            f2.setUTCHours(f2.getUTCHours() - 5);
            return {
                id_empl_cargo: obj.id_empl_cargo,
                hora_inicio: hora_inicio,
                hora_final: hora_final,
                fec_inicio: new Date(f1.toJSON().split('.')[0]),
                fec_final: new Date(f2.toJSON().split('.')[0]),
                descripcion: obj.descripcion,
                num_hora: HHMMtoHorasDecimal(obj.num_hora),
                tiempo_autorizado: HHMMtoHorasDecimal(obj.tiempo_autorizado),
                codigo: obj.codigo
            }
        }))
    });
}

async function PlanificacionHorasExtrasSolicitadasGrafica( fec_desde: Date, fec_hasta: Date) {
    return await pool.query('SELECT h.fecha_desde, h.hora_inicio, h.fecha_hasta, h.hora_fin, h.descripcion, h.horas_totales, ph.tiempo_autorizado, ph.codigo, ph.id_empl_cargo ' +
    'FROM plan_hora_extra_empleado AS ph, plan_hora_extra AS h WHERE ph.id_plan_hora = h.id AND ph.estado = 3 ' + //estado = 3 para horas extras autorizadas
    'AND h.fecha_desde between $1 and $2 AND h.fecha_hasta between $1 and $2 ORDER BY h.fecha_desde',[ fec_desde, fec_hasta])
    .then(result => {
        return Promise.all(result.rows.map(async(obj) => {
            var f1 = new Date(obj.fecha_desde.toJSON().split('T')[0] + 'T' + obj.hora_inicio);
            var f2 = new Date(obj.fecha_hasta.toJSON().split('T')[0] + 'T' + obj.hora_fin);
            f1.setUTCHours(f1.getUTCHours() - 5);
            f2.setUTCHours(f2.getUTCHours() - 5);
            const hora_inicio = HHMMtoHorasDecimal(f1.toJSON().split('T')[1].split('.')[0]);
            const hora_final = HHMMtoHorasDecimal(f2.toJSON().split('T')[1].split('.')[0]);
            f1.setUTCHours(f1.getUTCHours() - 5);
            f2.setUTCHours(f2.getUTCHours() - 5);
        return {
            id_empl_cargo: obj.id_empl_cargo,
            hora_inicio: hora_inicio,
            hora_final: hora_final,
            fec_inicio: new Date(f1.toJSON().split('.')[0]),
            fec_final: new Date(f2.toJSON().split('.')[0]),
            descripcion: obj.descripcion,
            num_hora: HHMMtoHorasDecimal(obj.horas_totales),
            tiempo_autorizado: HHMMtoHorasDecimal(obj.tiempo_autorizado),
            codigo: obj.codigo
        }
    }))
    })
}

export const HHMMtoHorasDecimal = function (dato: any) {
    if (dato === '') return 0
    if (dato === null) return 0
    // if (dato === 0) return 0
    // console.log(dato);
    var h = parseInt(dato.split(':')[0]);
    var m = parseInt(dato.split(':')[1])/60;
    var s = parseInt(dato.split(':')[2])/3600;
    // console.log(h, '>>>>>', m);
    return h + m + s
}

export const SumarValoresArray = function(array: any []) {
    let valor = 0;
    for (let i = 0; i < array.length; i++) {
        valor = valor + parseFloat(array[i]);
    }
    return valor.toFixed(2)
}

export const BuscarTimbresEoS = async function (fec_inicio: string, fec_final: string) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion = $3 ORDER BY fec_hora_timbre ASC ',[ fec_inicio, fec_final, 'EoS'])
        .then(res => {
            return res.rows;
        })
}

export const BuscarTimbresEoSModelado = async function (fec_inicio: string, fec_final: string) {
    var fec_aux = new Date(fec_inicio)

    var fecha1 = moment(fec_inicio);
    var fecha2 = moment(fec_final);

    var diasHorario = fecha2.diff(fecha1, 'days');
    let fechas_consulta: any = [];
    for (let i = 0; i <= diasHorario; i++) {
        fechas_consulta.push({fecha: fec_aux.toJSON().split('T')[0]})
        fec_aux.setDate(fec_aux.getDate() + 1)
    }

    let codigos = await pool.query('SELECT Distinct id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion = $3 ORDER BY id_empleado ASC ',[ fec_inicio, fec_final, 'EoS'])
        .then(res => {
            return res.rows;
        })
        
    let nuevo = await Promise.all(codigos.map(async(obj) => {
        let arr = await Promise.all(fechas_consulta.map(async(ele: any) => {
            return {
                fecha: ele.fecha,
                registros: await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), tecl_funcion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 AND accion = $3 ORDER BY fec_hora_timbre ASC ',[ ele.fecha, obj.id_empleado, 'EoS'])
                .then(res => {
                    return res.rows
                })
            }        
        }))            
        return {
            id_empleado: obj.id_empleado,
            timbres: arr,
            respuesta: new Array,
            horario: await pool.query('SELECT dh.hora, dh.orden FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
                'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
                'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden in (1, 4)',[obj.id_empleado, fec_inicio, fec_final])
                .then(res => {
                    return res.rows
                })
        }
    }))    
    
    nuevo.forEach((obj: any) => {
        obj.timbres = obj.timbres.filter((ele: any) => {
            return (ele.registros != 0)
        }).map((ele: any) => {
            ele.registros.forEach((obj1: any) => {
                obj1.fec_hora_timbre = HHMMtoHorasDecimal(obj1.fec_hora_timbre.split(' ')[1])
            });
            return ele
        });
        let set = new Set( obj.horario.map((nue: any) => { return JSON.stringify(nue)} ) )
        console.log(set);
        
        obj.horario = Array.from( set ).map((nue: any) => { return JSON.parse(nue)} );
    });

    return nuevo
}

export const ModelarAtrasos = async function (obj: any, fec_inicio: string, fec_final: string) {
    // console.log(obj);
    
    let array = await pool.query('SELECT dh.hora, dh.minu_espera FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
    'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden = 1 limit 1',[obj.id_empleado, fec_inicio, fec_final])
    .then(res => { return res.rows})
    // console.log('Array del resultado',array);

    if (array.length === 0) {
        return {
            fecha: obj.fec_hora_timbre,
            retraso: false
        }
    }
    return array.map(ele => {
        let retraso: boolean = false;
        var timbre = HHMMtoHorasDecimal(obj.fec_hora_timbre.split(' ')[1]) 
        var hora = HHMMtoHorasDecimal(ele.hora) + ele.minu_espera/60;

        (timbre > hora ) ? retraso = true : retraso = false;

        return {
            fecha: obj.fec_hora_timbre,
            retraso: retraso
        }
    })[0]
}

export const ModelarTiempoJornada = async function (obj: any, fec_inicio: string, fec_final: string) {
    // console.log(obj);
    
    let array = await pool.query('SELECT dh.hora, dh.orden FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
    'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden in (1, 4) ',[obj.id_empleado, fec_inicio, fec_final])
    .then(res => { return res.rows})
    // console.log('Array del resultado',array);

    if (array.length === 0) {
        return {
            fecha: obj.fec_hora_timbre,
            retraso: false
        }
    }
    return array.map(ele => {
        let retraso: boolean = false;
        var timbre = HHMMtoHorasDecimal(obj.fec_hora_timbre.split(' ')[1]) 
        var hora = HHMMtoHorasDecimal(ele.hora) + ele.minu_espera/60;

        (timbre > hora ) ? retraso = true : retraso = false;

        return {
            fecha: obj.fec_hora_timbre,
            retraso: retraso
        }
    })[0]
}

export const ModelarSalidasAnticipadas = async function (fec_inicio: string, fec_final: string) {
    // console.log(obj);
    let timbres = await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion in (\'EoS\') ORDER BY fec_hora_timbre ASC',[ fec_inicio, fec_final])
        .then(res => {
            return res.rows;
        }); 
    
    let nuevo = await Promise.all(timbres.map(async(obj) => {
        var f = new Date(obj.fec_hora_timbre);
        return {
            fecha: obj.fec_hora_timbre.split(' ')[0],
            hora_timbre: obj.fec_hora_timbre.split(' ')[1],
            codigo: obj.id_empleado,
            diferencia_tiempo: 0,
            hora_salida: await pool.query('SELECT dt.hora FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dt ' +
                'WHERE eh.fec_inicio < $1 AND eh.fec_final > $1 AND eh.codigo = $2 AND h.id = eh.id_horarios ' +
                'AND dt.id_horario = h.id AND dt.orden = 4', [f, obj.id_empleado])
                .then(res => {
                    return res.rows
                })
        }
    }));
    timbres = [];

    let array = nuevo.filter(obj => {
        return obj.hora_salida.length != 0
    }).map((obj: any) => {
        obj.hora_timbre = HHMMtoHorasDecimal(obj.hora_timbre)
        obj.hora_salida = HHMMtoHorasDecimal(obj.hora_salida[0].hora)
        return obj
    }).filter(obj => {
        var rango_inicio = obj.hora_salida - 3;
        obj.diferencia_tiempo = obj.hora_salida - obj.hora_timbre;
        return rango_inicio <= obj.hora_timbre && obj.hora_salida > obj.hora_timbre
    })
    nuevo = [];
    return array
}