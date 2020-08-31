import pool from '../database';
import {ITiempoLaboral, IAsistenciaDetalle} from '../class/Asistencia'

const HORA_EJECUTA_PROCESO = 12;

function sumaDias(fecha: Date, dias: number) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

function restaDias(fecha: Date, dias: number) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}

function CalcularEntradaAlmuerzo(hora: any, tiempo_almuerzo: any) { //tiempo solo en minutos transformar a HH:MM
    
    // console.log(hora,'=======>', tiempo_almuerzo);
    let hora_string;
    var x = tiempo_almuerzo/60; //min a hora

    let h = hora.split(':') //hora
    var a = parseInt(h[1]) / 60 //min a hora    
    var resultado = parseInt(h[0]) + a + x;

    var z = resultado - parseInt(resultado.toString());
    if (resultado <= 9) {
        hora_string = '0' + parseInt(resultado.toString()) + ':' + (z * 60)
    } else {
        hora_string = parseInt(resultado.toString()) + ':' + (z * 60)
    }

    return hora_string
}


/**
 * Metodo obtine un rango de fechas inicial y final de la semana en que se encuentre presente. 
 */
function ObtenerRangoSemanal(fHoy: Date) {

    fHoy.setUTCHours(0);
    fHoy.setUTCMinutes(0);
    
    var fechaInicio = new Date(fHoy); 
    var fechaFinal = new Date(fHoy); 
    let dia_suma = sumaDias(fechaFinal, 6 - fHoy.getDay())
    let dia_resta = restaDias(fechaInicio, fHoy.getDay())

    return {
        inicio: dia_resta,
        final: dia_suma
    }             
}

function ObtenerDiaIniciaSemana(fHoy: Date) {
    fHoy.setUTCHours(0);
    fHoy.setUTCMinutes(0);
    
    var fechaInicio = new Date(fHoy); 
    let dia_resta = restaDias(fechaInicio, fHoy.getDay())

    return dia_resta
}

async function ListaTimbresDiarioToEmpleado(hoy: any) {
    // aqui falta definir si es entrada, salida, entrada de almuerzo y salida de almuerzo === o crear mas funciones para cada uno
    return await pool.query('SELECT id_empleado, fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\'', [hoy])
    .then(result => {
        return result.rows.map(obj => {
            obj.fec_hora_timbre.setUTCHours(obj.fec_hora_timbre.getHours());
            return {
                id_empleado: obj.id_empleado,
                fec_hora_timbre: obj.fec_hora_timbre
            }
        })
    });
}

async function HorarioEmpleado(id_cargo: number, dia_inicia_semana: string, fechaIterada: Date) {
    return await pool.query('SELECT lunes, martes, miercoles, jueves, viernes, sabado, domingo FROM empl_horarios WHERE id_empl_cargo = $1 AND CAST(fec_inicio AS VARCHAR) like $2 || \'%\' ORDER BY fec_inicio ASC', [id_cargo, dia_inicia_semana])
    .then(result => {
        let respuesta: any = [];
        result.rows.forEach(res => {
            if (fechaIterada.getDay() === 0) {
                respuesta.push(res.lunes)
            } else if (fechaIterada.getDay() === 1) {
                respuesta.push(res.martes)
            } else if (fechaIterada.getDay() === 2) {
                respuesta.push(res.miercoles)
            } else if (fechaIterada.getDay() === 3) {
                respuesta.push(res.jueves)
            } else if (fechaIterada.getDay() === 4) {
                respuesta.push(res.viernes)
            } else if (fechaIterada.getDay() === 5) {
                respuesta.push(res.sabado)
            } else if (fechaIterada.getDay() === 6) {
                respuesta.push(res.domingo)
            } 
        })
        return {
            fec_iterada: fechaIterada.toJSON().split('T')[0],
            boolena_fecha: respuesta[0]
        }
    })  
}

async function UltimoCargoContrato(id_empleado: number) {
    return await pool.query('SELECT ca.id AS id_cargo, co.id AS id_contrato  FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND ca.id_empl_contrato = co.id ORDER BY co.fec_ingreso DESC, ca.fec_inicio DESC LIMIT 1', [id_empleado])
    .then(result => {
        return result.rows;
    })
}

function ListaSinTimbres_DiaLibre(hoy: string, bool: boolean) {
    return [{
        fec_hora_timbre: hoy,
        accion: 'L', 
        tecl_funcion: 0,
        labora: bool
    }]
}

async function ListaTimbresDiario(hoy: any, id_empleado: number, bool: boolean) {
    return await pool.query('SELECT fec_hora_timbre, accion, tecl_funcion FROM timbres WHERE id_empleado = $2 AND CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\'', [hoy, id_empleado])
    .then(result => {
        return result.rows.map(obj => {
            obj.fec_hora_timbre.setUTCHours(obj.fec_hora_timbre.getHours());
            return {
                fec_hora_timbre: obj.fec_hora_timbre, 
                accion: obj.accion, 
                tecl_funcion: obj.tecl_funcion,
                labora: bool
            }
        })
    });
}

function DiaEspaniol(dia: number) {
    let nom_dia = [ 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']
    return nom_dia[dia - 1]
}

function CalcularCamposFaltantes(obj: IAsistenciaDetalle, id_cargo: number, labora: boolean) {
    
    var x = new Date(obj.fecha);
    // console.log(obj.fecha, '===========' , x.getDay(), '=========', labora);
    if (obj.E.hora_timbre === '' && labora === true) {
        obj.E.descripcion = 'FT'
    }
    if (obj.S_A.hora_timbre === '' && labora === true) {
        obj.S_A.descripcion = 'FT'
    }
    if (obj.E_A.hora_timbre === '' && labora === true) {
        obj.E_A.descripcion = 'FT'
    }
    if (obj.S.hora_timbre === '' && labora === true) {
        obj.S.descripcion = 'FT'
    }

    if (labora === false) {
        obj.E.descripcion = 'L'
        obj.S_A.descripcion = 'L'
        obj.E_A.descripcion = 'L'
        obj.S.descripcion = 'L'
    }
        
    return obj
}

function CalculoHoraSalida(t: ITiempoLaboral) {
    // console.log('******************');    
    var c = t.h_ingreso.getUTCHours() // hora
    var d = t.h_ingreso.getUTCMinutes()/60 // hora

    var a = t.min_almuerzo/60 // horas
    
    var resultado = parseInt(t.h_trabaja.toString()) + a + c + d;
    var z = resultado - parseInt(resultado.toString());
    let hora_string;
    if (resultado <= 9) {
        hora_string = '0' + parseInt(resultado.toString()) + ':' + (z * 60)
    } else {
        hora_string = parseInt(resultado.toString()) + ':' + (z * 60)
    }
    // console.log('******************');
    return hora_string
}

function HHMMtoHorasDecimal(dato: any) {
    if (dato === '') return 0
    // console.log(dato);
    var h = parseInt(dato.split(':')[0]);
    var m = parseInt(dato.split(':')[1])/60;
    // console.log(h, '>>>>>', m);
    return h + m
}

function HorasDecimalToHHMM(dato: number) {
    var h = parseInt(dato.toString());
    var x = (dato - h) * 60;
    var m = parseInt(x.toString());

    let hora;
    let min;
    if (h < 10 && m < 10) {
        hora = '0' + h;
        min = '0' + m;
    } else if (h < 10 && m > 10) {
        hora = '0' + h;
        min = m;
    } else if (h > 10 && m < 10) {
        hora = h;
        min = '0' + m;
    } else if (h > 10 && m > 10) {
        hora = h;
        min = m;
    }

    return hora + ':' + min
}

function CalcularSalidasAntes(S_almuerzo: any, S_labor: any) {

    if (S_almuerzo.hora_timbre === '' && S_labor.hora_timbre === '') return '00:00'
    let al_def; let al_tim; let la_def; let la_tim;
    
    al_def = HHMMtoHorasDecimal(S_almuerzo.hora_default)
    al_tim = HHMMtoHorasDecimal(S_almuerzo.hora_timbre)
    la_def = HHMMtoHorasDecimal(S_labor.hora_default)
    la_tim = HHMMtoHorasDecimal(S_labor.hora_timbre)
    if (S_almuerzo.hora_timbre === '') {
        al_def = 0;
    }
    if (S_labor.hora_timbre === '') {
        la_def = 0;
    }

    let sum1;
    if (la_def > la_tim) {
        sum1 = la_def - la_tim;
    } else {
        sum1 = 0
    }
    let sum2
    if (al_def > al_tim) {
        sum2 = al_def - al_tim
    } else {
        sum2 = 0
    }

    var t = HorasDecimalToHHMM(sum1 + sum2);
    return t
}

function CalcularAlmuerzo(S_almuerzo: any, E_almuerzo: any) {
    var _s = HHMMtoHorasDecimal(S_almuerzo.hora_default); 
    var _e = HHMMtoHorasDecimal(E_almuerzo.hora_default); 
    var _res = HorasDecimalToHHMM(_e - _s);

    if (S_almuerzo.hora_timbre === '' || E_almuerzo.hora_timbre === '') return _res

    let s_tim; 
    let e_tim;
    
    s_tim = HHMMtoHorasDecimal(S_almuerzo.hora_timbre)
    e_tim = HHMMtoHorasDecimal(E_almuerzo.hora_timbre)
    
    return  HorasDecimalToHHMM(e_tim - s_tim)
}

function CalcularAtraso(h_default: string, h_timbre: string, minu_espera: any) {

    if (h_default === '') return '00:00';
    if (h_timbre === '') return '00:00';

    var def = parseInt(h_default.split(':')[0]) + (parseInt(h_default.split(':')[1])/60);
    var espera = (parseInt(minu_espera.split(':')[1])/60) + (def)

    var timbre = parseInt(h_timbre.split(':')[0]) + (parseInt(h_timbre.split(':')[1])/60);
    if (timbre < espera) {
        return '00:00'
    }

    var x = timbre - espera
    var y = parseInt(x.toString());
    var a = x * 60
    var z = parseInt(a.toString());
    let hora;
    let min;
    if (y < 10 && z < 10) {
        hora = '0' + y;
        min = '0' + z;
    } else if (y < 10 && z > 10) {
        hora = '0' + y;
        min = z;
    } else if (y > 10 && z < 10) {
        hora = y;
        min = '0' + z;
    } else if (y > 10 && z > 10) {
        hora = y;
        min = z;
    }
    // console.log(hora + ':' + min)
    return hora + ':' + min
}

function CalcularHorasTrabaja( entrada: any, salida: any, atraso: string, salida_antes: string, almuerzo: string) {

    if (entrada.descripcion === 'L' && salida.descripcion === 'L') return '00:00'
    
    if (entrada.hora_timbre === '' && salida.hora_timbre === '') {
        var _e = HHMMtoHorasDecimal(entrada.hora_default); 
        var _s = HHMMtoHorasDecimal(salida.hora_default); 
        var _a = HHMMtoHorasDecimal(almuerzo); 
        // console.log(_s -_e - _a);
        var _res = HorasDecimalToHHMM(_s -_e - _a);
        // console.log(_res);
        return _res
    } 
    var _e = HHMMtoHorasDecimal(entrada.hora_timbre); 
    var _s = HHMMtoHorasDecimal(salida.hora_timbre); 
    var _a = HHMMtoHorasDecimal(almuerzo); 
    var _res = HorasDecimalToHHMM(_s -_e - _a);

    return _res
}

function AsistenciaDetalleConsolidado(arr: any, tlaboral: ITiempoLaboral, id_cargo: number, minu_espera: any) {
    let AsistenciaArray: any = [];
    let salidaGeneral = CalculoHoraSalida(tlaboral);
    arr.forEach((result: any) => {
        let detalleAsistencia: IAsistenciaDetalle = {
            fecha: '',
            fecha_mostrar: '',
            E: {
                hora_default: '',
                hora_timbre: '',
                descripcion: ''
            },
            S_A: {
                hora_default: '',
                hora_timbre: '',
                descripcion: ''
            },
            E_A: {
                hora_default: '',
                hora_timbre: '',
                descripcion: ''
            },
            S: {
                hora_default: '',
                hora_timbre: '',
                descripcion: ''
            },
            atraso: null || '',
            sal_antes: null || '',
            almuerzo: null || '',
            hora_trab: null || '',
            hora_supl: null || '',
            hora_ex_L_V: null || '',
            hora_ex_S_D: null || ''
        }
        let contador = 0;
        result.forEach((obj: any) => {            
            if ( obj.accion === 'E') {
                detalleAsistencia.fecha = obj.fec_hora_timbre.toJSON();
                detalleAsistencia.fecha_mostrar = DiaEspaniol(obj.fec_hora_timbre.getDay()) + ' ' + obj.fec_hora_timbre.toJSON().split('T')[0]
                
                detalleAsistencia.E.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0,5)
            } else if ( obj.accion === 'S/A') {
                detalleAsistencia.S_A.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0,5)
                
            } else if ( obj.accion === 'E/A') {
                detalleAsistencia.E_A.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0,5)
                
            } else if ( obj.accion === 'S') {
                detalleAsistencia.S.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0,5)
                
            } else if (obj.accion === 'L') {
                var f = new Date(obj.fec_hora_timbre)
                detalleAsistencia.fecha = f.toJSON();
                detalleAsistencia.fecha_mostrar = DiaEspaniol(f.getDay() + 1 ) + ' ' + f.toJSON().split('T')[0]
                
                detalleAsistencia.E.hora_default = tlaboral.h_ingreso.toJSON().split('T')[1].slice(0,5)
                detalleAsistencia.S_A.hora_default = '13:00'
                detalleAsistencia.E_A.hora_default = CalcularEntradaAlmuerzo('13:00', tlaboral.min_almuerzo)
                detalleAsistencia.S.hora_default = salidaGeneral
            }
            contador = contador + 1

            if (result.length === contador && obj.accion != 'L') {
                detalleAsistencia.E.hora_default = tlaboral.h_ingreso.toJSON().split('T')[1].slice(0,5)
                detalleAsistencia.S_A.hora_default = '13:00'
                detalleAsistencia.E_A.hora_default = CalcularEntradaAlmuerzo(detalleAsistencia.S_A.hora_timbre, tlaboral.min_almuerzo)
                if (detalleAsistencia.S_A.hora_timbre === '') {
                    detalleAsistencia.E_A.hora_default = CalcularEntradaAlmuerzo(detalleAsistencia.S_A.hora_default, tlaboral.min_almuerzo)
                }
                detalleAsistencia.S.hora_default = salidaGeneral
            }
            if ( result.length === contador ) {
                
                // atraso
                detalleAsistencia.atraso = CalcularAtraso(detalleAsistencia.E.hora_default, detalleAsistencia.E.hora_timbre, minu_espera)
                // Tiempo salidas antes
                detalleAsistencia.sal_antes = CalcularSalidasAntes(detalleAsistencia.S_A, detalleAsistencia.S);
                // almuerzo
                detalleAsistencia.almuerzo = CalcularAlmuerzo(detalleAsistencia.S_A, detalleAsistencia.E_A);

                // Calculos Faltantes
                let calculados = CalcularCamposFaltantes(detalleAsistencia, id_cargo, obj.labora) as IAsistenciaDetalle
                // horas trabaja
                calculados.hora_trab = CalcularHorasTrabaja(calculados.E, calculados.S, calculados.atraso, calculados.sal_antes, calculados.almuerzo)
                // console.log(result.length);
                calculados.hora_supl = '00:00';
                calculados.hora_ex_L_V = '00:00';
                calculados.hora_ex_S_D = '00:00';
                AsistenciaArray.push(calculados)
            }
        });
    });

    console.log(AsistenciaArray.length);
    
    return AsistenciaArray
}

async function MetodoModelarDetalleAsistencia(id_empleado: number, desde: Date, hasta: Date, TiemposEmpleado: ITiempoLaboral, id_cargo: number) {
    let arr: any = [];
    let minu_espera = await pool.query('SELECT distinct dh.minu_espera FROM empl_horarios AS eh, cg_horarios AS ch, deta_horarios AS dh WHERE eh.id_empl_cargo = $1 AND eh.id_horarios = ch.id AND dh.id_horario = ch.id',[id_cargo])
                        .then(result => { return result.rows[0].minu_espera});
    for (let i = 1; i <= hasta.getDate() + 1; i++) {
        let semanaFecha = ObtenerDiaIniciaSemana(new Date(desde))    
        let horarios = await HorarioEmpleado(id_cargo, semanaFecha.toJSON().split('T')[0], desde);
        
        let aux = await ListaTimbresDiario(desde.toJSON().split('T')[0], id_empleado, horarios.boolena_fecha)
        if (aux.length != 0) {
            arr.push(aux)
        } else {
            let nuevo = ListaSinTimbres_DiaLibre(desde.toJSON(), horarios.boolena_fecha)
            arr.push(nuevo)
        }
        desde.setDate(i)
        desde.setMonth(hasta.getMonth());
    }
    // console.log(arr);
    let AsistenciaArray = AsistenciaDetalleConsolidado(arr, TiemposEmpleado, id_cargo, minu_espera);

    return AsistenciaArray
}


export const RegistrarAsistenciaByTimbres = async function() {
    setInterval(async() => {
        
        var f = new Date();
        let hora = f.getHours();
        console.log(f.toString());
        console.log('======================================');
        
        if( hora === HORA_EJECUTA_PROCESO) {
            f.setUTCHours(f.getHours());

            f.setDate(f.getDate() - 5);// para realizar pruebas
            
            let hoy = f.toJSON().split("T")[0];
            // let rango_dias = ObtenerRango();
            // console.log(rango_dias);
            let timbresEmpleado = await ListaTimbresDiarioToEmpleado(hoy)
            console.log(timbresEmpleado);
            
        }
        console.log('======================================');
        
        
    }, 1000000);
}

async function HoraIngreso_MinAlmuerzo_HorasLabora(id_cargo: number) {
    return await pool.query('SELECT distinct dh.hora, ch.min_almuerzo, ch.hora_trabajo FROM empl_horarios AS eh, cg_horarios AS ch, deta_horarios AS dh WHERE eh.id_empl_cargo = $1 AND ch.id = eh.id_horarios AND ch.id = dh.id_horario', [id_cargo])
    .then(result => {
        return result.rows[0]
    })
}
export const ContarHorasByCargo = async function(id_empleado: number, desde: Date, hasta: Date) {

    let ids = await UltimoCargoContrato(id_empleado);
    console.log(ids);
    
    let horaIngresoEmpl = await HoraIngreso_MinAlmuerzo_HorasLabora(ids[0].id_cargo).then(result => {
        var fecha_hora = new Date();
        fecha_hora.setUTCHours(parseInt(result.hora.split(':')[0]))
        fecha_hora.setUTCMinutes(parseInt(result.hora.split(':')[1]));
        fecha_hora.setUTCSeconds(parseInt(result.hora.split(':')[2]))
        return { 
            h_ingreso: fecha_hora,
            min_almuerzo: result.min_almuerzo,
            h_trabaja: result.hora_trabajo
        }
    }) as ITiempoLaboral;

    const empleado = await ObtenerInformacionEmpleado(id_empleado)
    
    const DetalleConsolidado = await MetodoModelarDetalleAsistencia(id_empleado, desde, hasta, horaIngresoEmpl, ids[0].id_cargo)

    const total = await CalcularTotal(DetalleConsolidado)
    console.log(total);
    
    let ReporteConsolidadoJsop = {
        empleado: [empleado],
        detalle: DetalleConsolidado,
        operaciones: total
    }

    return ReporteConsolidadoJsop
}

async function CalcularTotal(arr: any) {

    let dataDecimal = {
        atraso: null || 0,
        sal_antes: null || 0,
        almuerzo: null || 0,
        hora_trab: null || 0,
        hora_supl: null || 0,
        hora_ex_L_V: null || 0,
        hora_ex_S_D: null || 0
    }

    arr.forEach((obj: any) => {
        dataDecimal.atraso = HHMMtoHorasDecimal(obj.atraso) + dataDecimal.atraso
        dataDecimal.sal_antes = HHMMtoHorasDecimal(obj.sal_antes) + dataDecimal.sal_antes
        dataDecimal.almuerzo = HHMMtoHorasDecimal(obj.almuerzo) + dataDecimal.almuerzo
        dataDecimal.hora_trab = HHMMtoHorasDecimal(obj.hora_trab) + dataDecimal.hora_trab
        dataDecimal.hora_supl = HHMMtoHorasDecimal(obj.hora_supl) + dataDecimal.hora_supl
        dataDecimal.hora_ex_L_V = HHMMtoHorasDecimal(obj.hora_ex_L_V) + dataDecimal.hora_ex_L_V
        dataDecimal.hora_ex_S_D = HHMMtoHorasDecimal(obj.hora_ex_S_D) + dataDecimal.hora_ex_S_D
    });
    
    let dataHHMM = { 
        atraso: HorasDecimalToHHMM(dataDecimal.atraso),
        sal_antes: HorasDecimalToHHMM(dataDecimal.sal_antes),
        almuerzo: HorasDecimalToHHMM(dataDecimal.almuerzo),
        hora_trab: HorasDecimalToHHMM(dataDecimal.hora_trab),
        hora_supl: HorasDecimalToHHMM(dataDecimal.hora_supl),
        hora_ex_L_V: HorasDecimalToHHMM(dataDecimal.hora_ex_L_V),
        hora_ex_S_D: HorasDecimalToHHMM(dataDecimal.hora_ex_S_D)
    }
    console.log(dataDecimal);
    console.log(dataHHMM);
    
    return [{
        decimal: dataDecimal,
        HHMM: dataHHMM
    }]
}

async function ObtenerInformacionEmpleado(id_empleado: number) {
    let ObjetoEmpleado: any = {
        nombre: '',
        ciudad: '',
        cedula: '',
        codigo: '',
    }

    let data = await pool.query('SELECT e.nombre, e.apellido, e.cedula, e.codigo, c.descripcion FROM empleados AS e, empl_contratos AS co, empl_cargos AS ca, sucursales AS s, ciudades AS c WHERE e.id = $1 AND e.id = co.id_empleado AND ca.id_empl_contrato = co.id AND s.id = ca.id_sucursal AND s.id_ciudad = c.id ORDER BY co.fec_ingreso DESC LIMIT 1', [id_empleado])
                .then(result => {
                    return result.rows[0];
                });
    ObjetoEmpleado.nombre = data.nombre + ' ' + data.apellido;
    ObjetoEmpleado.ciudad = data.descripcion;
    ObjetoEmpleado.cedula = data.cedula;
    ObjetoEmpleado.codigo = data.codigo;

    return ObjetoEmpleado
}