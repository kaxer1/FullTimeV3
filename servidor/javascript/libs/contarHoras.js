"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const moment_1 = __importDefault(require("moment"));
const HORA_EJECUTA_PROCESO = 12;
function sumaDias(fecha, dias) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}
function restaDias(fecha, dias) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}
function CalcularEntradaAlmuerzo(hora, tiempo_almuerzo) {
    // console.log(hora,'=======>', tiempo_almuerzo);
    let hora_string;
    var x = tiempo_almuerzo / 60; //min a hora
    let h = hora.split(':'); //hora
    var a = parseInt(h[1]) / 60; //min a hora  
    var resultado = parseInt(h[0]) + parseInt(a.toString().split('.')[0]) + x;
    var z = resultado - parseInt(resultado.toString());
    if (resultado <= 9) {
        hora_string = '0' + parseInt(resultado.toString()) + ':' + (z * 60);
    }
    else {
        hora_string = parseInt(resultado.toString()) + ':' + (z * 60);
    }
    return hora_string;
}
/**
 * Metodo obtine un rango de fechas inicial y final de la semana en que se encuentre presente.
 */
function ObtenerRangoSemanal(fHoy) {
    fHoy.setUTCHours(0);
    fHoy.setUTCMinutes(0);
    var fechaInicio = new Date(fHoy);
    var fechaFinal = new Date(fHoy);
    let dia_suma = sumaDias(fechaFinal, 6 - fHoy.getDay());
    let dia_resta = restaDias(fechaInicio, fHoy.getDay());
    return {
        inicio: dia_resta,
        final: dia_suma
    };
}
function ObtenerDiaIniciaSemana(fHoy) {
    fHoy.setUTCHours(0);
    fHoy.setUTCMinutes(0);
    var fechaInicio = new Date(fHoy);
    let dia_resta = restaDias(fechaInicio, fHoy.getDay());
    return dia_resta;
}
function ListaTimbresDiarioToEmpleado(hoy) {
    return __awaiter(this, void 0, void 0, function* () {
        // aqui falta definir si es entrada, salida, entrada de almuerzo y salida de almuerzo === o crear mas funciones para cada uno
        return yield database_1.default.query('SELECT id_empleado, fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\'', [hoy])
            .then(result => {
            return result.rows.map(obj => {
                obj.fec_hora_timbre.setUTCHours(obj.fec_hora_timbre.getHours());
                return {
                    id_empleado: obj.id_empleado,
                    fec_hora_timbre: obj.fec_hora_timbre
                };
            });
        });
    });
}
function GenerarHorarioEmpleado(id_cargo, inicio, final) {
    return __awaiter(this, void 0, void 0, function* () {
        let horarioAnual = yield database_1.default.query('SELECT id_horarios, fec_inicio, fec_final, domingo, lunes, martes, miercoles, jueves, viernes, sabado ' +
            'FROM empl_horarios WHERE estado = 1 AND id_empl_cargo = $1 AND CAST(fec_inicio AS VARCHAR) like $2 || \'%\' ORDER BY fec_inicio ASC', [id_cargo, inicio.toJSON().split('-')[0]])
            .then(result => {
            return result.rows;
        });
        // console.log(horarioAnual);
        if (horarioAnual.length === 0)
            return { message: 'No tienen asignado horario' };
        if (horarioAnual.length === 1) { // referencia a horario anual
            var fecha1 = moment_1.default(horarioAnual[0].fec_inicio.toJSON().split("T")[0]);
            var fecha2 = moment_1.default(horarioAnual[0].fec_final.toJSON().split("T")[0]);
            var diasHorario = fecha2.diff(fecha1, 'days');
            if (diasHorario > 300) { // compruevo si es realmente horario anual
                console.log('*************************');
                console.log('LLEGO A HORARIO ANUAL');
                console.log('*************************');
                return HorarioConEstado(horarioAnual, inicio, final);
            }
        }
        let horarioMensual = horarioAnual.filter(obj => {
            return (obj.fec_inicio.toJSON().split('-')[1] === inicio.toJSON().split('-')[1] || obj.fec_final.toJSON().split('-')[1] === final.toJSON().split('-')[1]);
        });
        // console.log(horarioMensual);
        if (horarioMensual.length === 0)
            return { message: 'No tiene asignado horario para ese mes' };
        if (horarioMensual.length === 1) { //referencia a un horario mensual
            var fecha1 = moment_1.default(horarioMensual[0].fec_inicio.toJSON().split("T")[0]);
            var fecha2 = moment_1.default(horarioMensual[0].fec_final.toJSON().split("T")[0]);
            var diasHorario = fecha2.diff(fecha1, 'days');
            if (diasHorario > 25) { // compruevo si es realmente horario mensual
                console.log('*************************');
                console.log('LLEGO A HORARIO MENSUAL');
                console.log('*************************');
                return HorarioConEstado(horarioMensual, inicio, final);
            }
        }
        console.log('*************************');
        console.log('LLEGO A SEMANAL');
        console.log('*************************');
        let EstadosHorarioSemanal = [];
        horarioMensual.forEach(obj => {
            let arr = HorarioConEstado([obj], obj.fec_inicio, obj.fec_final);
            arr.forEach((ele) => {
                EstadosHorarioSemanal.push(ele);
            });
        });
        // console.log(EstadosHorarioSemanal);        
        return EstadosHorarioSemanal.filter((obj) => {
            var fecha = new Date(obj.fec_iterada);
            return (fecha >= inicio && fecha <= final);
        });
    });
}
function HorarioConEstado(estados, inicio, final) {
    var fecha1 = moment_1.default(inicio.toJSON().split("T")[0]);
    var fecha2 = moment_1.default(final.toJSON().split("T")[0]);
    // console.log('ESTADOSSSSSSSS',estados);
    var diasHorario = fecha2.diff(fecha1, 'days');
    let horarioSemanalEstados = [];
    estados.forEach((obj) => {
        horarioSemanalEstados.push(obj.domingo);
        horarioSemanalEstados.push(obj.lunes);
        horarioSemanalEstados.push(obj.martes);
        horarioSemanalEstados.push(obj.miercoles);
        horarioSemanalEstados.push(obj.jueves);
        horarioSemanalEstados.push(obj.viernes);
        horarioSemanalEstados.push(obj.sabado);
    });
    console.log(horarioSemanalEstados);
    let arrayRespuesta = [];
    for (let i = 0; i <= diasHorario; i++) {
        // console.log(inicio.toJSON(),'Dia de la semana',inicio.getUTCDay());
        let objeto = {
            fec_iterada: inicio.toJSON().split('T')[0],
            boolena_fecha: horarioSemanalEstados[inicio.getUTCDay()],
            id_horarios: estados[0].id_horarios
        };
        arrayRespuesta.push(objeto);
        // console.log(inicio.toJSON(),'Dia de la seman: ', inicio.getDay());
        inicio.setDate(inicio.getDate() + 1);
    }
    return arrayRespuesta;
}
function UltimoCargoContrato(id_empleado, desde) {
    return __awaiter(this, void 0, void 0, function* () {
        let horarios = yield database_1.default.query('SELECT ho.id_empl_cargo AS id_cargo, ho.fec_inicio, ho.fec_final, ho.id_horarios FROM empl_contratos AS co, empl_cargos AS ca, empl_horarios AS ho ' +
            'WHERE co.id_empleado = $1 AND ca.id_empl_contrato = co.id AND ca.id = ho.id_empl_cargo ' +
            'AND CAST(ho.fec_inicio AS VARCHAR) LIKE $2 || \'%\'', [id_empleado, desde.toJSON().split('-')[0]])
            .then(result => {
            return result.rows;
        });
        // console.log(horarios);
        if (horarios.length === 0)
            return { message: 'No tienen horarios' };
        let horario;
        if (horarios.length === 1) {
            horario = horarios;
        }
        else {
            horario = horarios.filter(obj => {
                return (obj.fec_inicio.toJSON().split('-')[1] === desde.toJSON().split('-')[1] || obj.fec_final.toJSON().split('-')[1] === desde.toJSON().split('-')[1]);
            });
        }
        // console.log(horario);
        let _ids = horarios.map(obj => {
            return {
                id_cargo: obj.id_cargo,
                id_horarios: obj.id_horarios
            };
        });
        let set = new Set(_ids.map(obj => { return JSON.stringify(obj); }));
        let arrSinDuplicaciones = Array.from(set).map(obj => { return JSON.parse(obj); });
        // console.log(set);
        return arrSinDuplicaciones;
    });
}
function ListaSinTimbres_DiaLibre(hoy, bool, id_horarios) {
    return [{
            fec_hora_timbre: hoy,
            accion: 'L',
            tecl_funcion: 0,
            labora: bool,
            id_horarios: id_horarios,
            orden: 0
        }];
}
function ListaTimbresDiario(hoy, id_empleado, bool, id_horarios, IhorarioLaboral) {
    return __awaiter(this, void 0, void 0, function* () {
        let timbres = yield database_1.default.query('SELECT fec_hora_timbre, accion, tecl_funcion FROM timbres WHERE id_empleado = $2 AND CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' ORDER BY fec_hora_timbre', [hoy, id_empleado])
            .then(result => {
            return result.rows.map(obj => {
                obj.fec_hora_timbre.setUTCHours(obj.fec_hora_timbre.getHours());
                return {
                    fec_hora_timbre: obj.fec_hora_timbre,
                    accion: obj.accion,
                    tecl_funcion: obj.tecl_funcion,
                    labora: bool,
                    id_horarios: id_horarios,
                    orden: IhorarioLaboral.map((mapping1) => {
                        return mapping1.datos.filter(o => {
                            const hora = parseInt(o.hora.split(':')[0]);
                            let fi_hora = hora - 1;
                            fi_hora < 0 ? fi_hora = 23 : fi_hora = fi_hora;
                            let ff_hora = hora + 1;
                            ff_hora === 24 ? ff_hora = 0 : ff_hora = ff_hora;
                            var fi = new Date(obj.fec_hora_timbre);
                            fi.setUTCHours(fi_hora);
                            fi.setUTCMinutes(0);
                            fi.setUTCSeconds(0);
                            var fhora = new Date(obj.fec_hora_timbre);
                            var ff = new Date(obj.fec_hora_timbre);
                            ff.setUTCHours(ff_hora);
                            ff.setUTCMinutes(0);
                            ff.setUTCSeconds(0);
                            // console.log(ff, fhora, fi);
                            return (ff >= fhora && fi <= fhora);
                        }).map(mapping2 => {
                            return mapping2.orden;
                        })[0];
                    })[0]
                };
            });
        });
        console.log(timbres);
        return timbres;
    });
}
function DiaEspaniol(dia) {
    let nom_dia = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    return nom_dia[dia];
}
function CalcularCamposFaltantes(obj, labora) {
    var x = new Date(obj.fecha);
    // console.log(obj.fecha, '===========' , x.getDay(), '=========', labora);
    if (obj.E.hora_timbre === '' && labora === false) { //false => son dias normales
        obj.E.descripcion = 'FT';
    }
    if (obj.S_A.hora_timbre === '' && labora === false) {
        obj.S_A.descripcion = 'FT';
    }
    if (obj.E_A.hora_timbre === '' && labora === false) {
        obj.E_A.descripcion = 'FT';
    }
    if (obj.S.hora_timbre === '' && labora === false) {
        obj.S.descripcion = 'FT';
    }
    if (labora === true) { //true => son dias libres
        obj.E.descripcion = 'L';
        obj.S_A.descripcion = 'L';
        obj.E_A.descripcion = 'L';
        obj.S.descripcion = 'L';
    }
    return obj;
}
/*
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
*/
function HHMMtoHorasDecimal(dato) {
    if (dato === '')
        return 0;
    // if (dato === 0) return 0
    // console.log(dato);
    var h = parseInt(dato.split(':')[0]);
    var m = parseInt(dato.split(':')[1]) / 60;
    // console.log(h, '>>>>>', m);
    return h + m;
}
function HorasDecimalToHHMM(dato) {
    // console.log('Hora decimal a HHMM ======>',dato);
    var h = parseInt(dato.toString());
    var x = (dato - h) * 60;
    var m = parseInt(x.toString());
    let hora;
    let min;
    if (h < 10 && m < 10) {
        hora = '0' + h;
        min = '0' + m;
    }
    else if (h < 10 && m >= 10) {
        hora = '0' + h;
        min = m;
    }
    else if (h >= 10 && m < 10) {
        hora = h;
        min = '0' + m;
    }
    else if (h >= 10 && m >= 10) {
        hora = h;
        min = m;
    }
    return hora + ':' + min;
}
function CalcularSalidasAntes(S_almuerzo, S_labor) {
    if (S_almuerzo.hora_timbre === '' && S_labor.hora_timbre === '')
        return '00:00';
    let al_def;
    let al_tim;
    let la_def;
    let la_tim;
    al_def = HHMMtoHorasDecimal(S_almuerzo.hora_default);
    al_tim = HHMMtoHorasDecimal(S_almuerzo.hora_timbre);
    la_def = HHMMtoHorasDecimal(S_labor.hora_default);
    la_tim = HHMMtoHorasDecimal(S_labor.hora_timbre);
    if (S_almuerzo.hora_timbre === '') {
        al_def = 0;
    }
    if (S_labor.hora_timbre === '') {
        la_def = 0;
    }
    let sum1;
    if (la_def > la_tim) {
        sum1 = la_def - la_tim;
    }
    else {
        sum1 = 0;
    }
    let sum2;
    if (al_def > al_tim) {
        sum2 = al_def - al_tim;
    }
    else {
        sum2 = 0;
    }
    var t = HorasDecimalToHHMM(sum1 + sum2);
    return t;
}
function CalcularAlmuerzo(S_almuerzo, E_almuerzo) {
    var _s = HHMMtoHorasDecimal(S_almuerzo.hora_default);
    var _e = HHMMtoHorasDecimal(E_almuerzo.hora_default);
    var _res = HorasDecimalToHHMM(_e - _s);
    if (S_almuerzo.hora_timbre === '' || E_almuerzo.hora_timbre === '')
        return _res;
    let s_tim;
    let e_tim;
    s_tim = HHMMtoHorasDecimal(S_almuerzo.hora_timbre);
    e_tim = HHMMtoHorasDecimal(E_almuerzo.hora_timbre);
    return HorasDecimalToHHMM(e_tim - s_tim);
}
function CalcularAtraso(h_default, h_timbre, minu_espera) {
    if (h_default === '')
        return '00:00';
    if (h_timbre === '')
        return '00:00';
    // if (minu_espera === 0) {
    //     minu_espera = '00:00'
    // } 
    // console.log('Horas',h_default, h_timbre, minu_espera);
    var def = parseInt(h_default.split(':')[0]) + (parseInt(h_default.split(':')[1]) / 60);
    var espera = (minu_espera / 60) + (def);
    var timbre = parseInt(h_timbre.split(':')[0]) + (parseInt(h_timbre.split(':')[1]) / 60);
    if (timbre < espera) {
        return '00:00';
    }
    var x = timbre - espera;
    var y = parseInt(x.toString());
    var a = x * 60;
    var z = parseInt(a.toString());
    let hora;
    let min;
    if (y < 10 && z < 10) {
        hora = '0' + y;
        min = '0' + z;
    }
    else if (y < 10 && z >= 10) {
        hora = '0' + y;
        min = z;
    }
    else if (y >= 10 && z < 10) {
        hora = y;
        min = '0' + z;
    }
    else if (y >= 10 && z >= 10) {
        hora = y;
        min = z;
    }
    // console.log(hora + ':' + min)
    return hora + ':' + min;
}
function CalcularHorasTrabaja(entrada, salida, atraso, salida_antes, almuerzo) {
    // console.log(entrada, salida, atraso, salida_antes, almuerzo);    
    if (entrada.descripcion === 'L' && salida.descripcion === 'L')
        return '00:00';
    if (entrada.hora_timbre === '' && salida.hora_timbre === '') {
        var _e = HHMMtoHorasDecimal(entrada.hora_default);
        let _s = HHMMtoHorasDecimal(salida.hora_default);
        var _a = HHMMtoHorasDecimal(almuerzo);
        // console.log(_s -_e - _a);
        if (_s > _e) {
            return HorasDecimalToHHMM(_s - _e - _a);
        }
        else if (_e > _s) {
            _e = 24 - _e;
            return HorasDecimalToHHMM((_s + _e) - _a);
        }
    }
    var _e = HHMMtoHorasDecimal(entrada.hora_timbre);
    var _s = HHMMtoHorasDecimal(salida.hora_timbre);
    var _a = HHMMtoHorasDecimal(almuerzo);
    let _res;
    if (_s > _e) {
        _res = HorasDecimalToHHMM(_s - _e - _a);
    }
    else if (_e > _s) {
        _e = 24 - _e;
        _res = HorasDecimalToHHMM((_s + _e) - _a);
    }
    return _res;
}
function AsistenciaDetalleConsolidado(arr, IhorarioLaboral, id_cargo) {
    // console.log('Metodo asistencia detalle consolidado:', IhorarioLaboral);
    let AsistenciaArray = [];
    // let salidaGeneral = CalculoHoraSalida(IhorarioLaboral);
    arr.forEach((result) => {
        // console.log(result);
        let detalleAsistencia = {
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
        };
        let contador = 0;
        result.forEach((obj) => {
            IhorarioLaboral.filter((ele_filtro) => { return (obj.id_horarios === ele_filtro.id_horario); })
                .map((ele_map) => {
                let entrada_default = ele_map.datos[0].hora.split(':')[0] + ':' + ele_map.datos[0].hora.split(':')[1];
                let salida_almuerzo_default = ele_map.datos[1].hora.split(':')[0] + ':' + ele_map.datos[1].hora.split(':')[1];
                let entrada_almuerzo_default = ele_map.datos[2].hora.split(':')[0] + ':' + ele_map.datos[2].hora.split(':')[1];
                let salida_default = ele_map.datos[3].hora.split(':')[0] + ':' + ele_map.datos[3].hora.split(':')[1];
                if (obj.orden === 1) {
                    detalleAsistencia.E.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0, 5);
                }
                else if (obj.orden === 2) {
                    detalleAsistencia.S_A.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0, 5);
                }
                else if (obj.orden === 3) {
                    detalleAsistencia.E_A.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0, 5);
                }
                else if (obj.orden === 4) {
                    detalleAsistencia.S.hora_timbre = obj.fec_hora_timbre.toJSON().split('T')[1].slice(0, 5);
                    // Fecha
                    detalleAsistencia.fecha = obj.fec_hora_timbre.toJSON();
                    detalleAsistencia.fecha_mostrar = DiaEspaniol(obj.fec_hora_timbre.getDay()) + ' ' + obj.fec_hora_timbre.toJSON().split('T')[0];
                }
                else if (obj.accion === 'L') {
                    var f = new Date(obj.fec_hora_timbre);
                    detalleAsistencia.fecha = f.toJSON();
                    detalleAsistencia.fecha_mostrar = DiaEspaniol(f.getUTCDay()) + ' ' + f.toJSON().split('T')[0];
                    detalleAsistencia.E.hora_default = entrada_default || '08:30';
                    detalleAsistencia.S_A.hora_default = salida_almuerzo_default || '12:45';
                    detalleAsistencia.E_A.hora_default = entrada_almuerzo_default || '14:00';
                    detalleAsistencia.S.hora_default = salida_default || '17:00';
                    // detalleAsistencia.E_A.hora_default = CalcularEntradaAlmuerzo('13:00', tlaboral.min_almuerzo)
                    // detalleAsistencia.S.hora_default = salidaGeneral
                }
                contador = contador + 1;
                if (result.length === contador && obj.accion != 'L') {
                    detalleAsistencia.E.hora_default = entrada_default || '08:30';
                    detalleAsistencia.S_A.hora_default = salida_almuerzo_default || '12:45';
                    detalleAsistencia.E_A.hora_default = CalcularEntradaAlmuerzo(detalleAsistencia.S_A.hora_timbre, ele_map.min_almuerzo) || entrada_almuerzo_default;
                    if (detalleAsistencia.S_A.hora_timbre === '') {
                        detalleAsistencia.E_A.hora_default = CalcularEntradaAlmuerzo(detalleAsistencia.S_A.hora_default, ele_map.min_almuerzo) || entrada_almuerzo_default;
                    }
                    detalleAsistencia.S.hora_default = salida_default || '17:00';
                    // detalleAsistencia.S.hora_default = salidaGeneral
                }
                if (result.length === contador) {
                    // atraso
                    detalleAsistencia.atraso = CalcularAtraso(detalleAsistencia.E.hora_default, detalleAsistencia.E.hora_timbre, ele_map.datos[0].minu_espera);
                    // Tiempo salidas antes
                    detalleAsistencia.sal_antes = CalcularSalidasAntes(detalleAsistencia.S_A, detalleAsistencia.S);
                    // almuerzo
                    detalleAsistencia.almuerzo = CalcularAlmuerzo(detalleAsistencia.S_A, detalleAsistencia.E_A);
                    // 
                    // detalleAsistencia.hora_trab = '';
                    // detalleAsistencia.hora_ex_L_V = '';
                    // detalleAsistencia.hora_ex_S_D = '';
                    // Calculos Faltantes
                    let calculados = CalcularCamposFaltantes(detalleAsistencia, obj.labora);
                    // horas trabaja
                    calculados.hora_trab = CalcularHorasTrabaja(calculados.E, calculados.S, calculados.atraso, calculados.sal_antes, calculados.almuerzo) || '08:00';
                    calculados.hora_supl = '00:00';
                    calculados.hora_ex_L_V = '00:00';
                    calculados.hora_ex_S_D = '00:00';
                    AsistenciaArray.push(calculados);
                }
            });
        });
    });
    console.log(AsistenciaArray.length);
    // console.log(AsistenciaArray);
    return AsistenciaArray;
}
function MetodoModelarDetalleAsistencia(id_empleado, desde, hasta, IhorarioLaboral, id_cargo) {
    return __awaiter(this, void 0, void 0, function* () {
        let horarios = yield GenerarHorarioEmpleado(id_cargo, desde, hasta);
        console.log('horarios===', horarios);
        let arr = yield Promise.all(horarios.map((obj) => __awaiter(this, void 0, void 0, function* () {
            let aux = yield ListaTimbresDiario(obj.fec_iterada, id_empleado, obj.boolena_fecha, obj.id_horarios, IhorarioLaboral);
            if (aux.length != 0) {
                return aux;
            }
            else {
                let nuevo = ListaSinTimbres_DiaLibre(obj.fec_iterada, obj.boolena_fecha, obj.id_horarios);
                return nuevo;
            }
        })));
        // console.log('########################################################');
        // console.log(arr);
        // console.log('########################################################');
        let AsistenciaArray = AsistenciaDetalleConsolidado(arr, IhorarioLaboral, id_cargo);
        return AsistenciaArray;
    });
}
function DetalleHorario(id_horarios) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            id_horario: id_horarios,
            min_almuerzo: yield database_1.default.query('SELECT min_almuerzo FROM cg_horarios WHERE id = $1', [id_horarios])
                .then(result => {
                return result.rows[0].min_almuerzo;
            }),
            datos: yield database_1.default.query('SELECT orden, hora, tipo_accion, minu_espera, nocturno FROM deta_horarios WHERE id_horario = $1 ORDER BY orden ASC', [id_horarios])
                .then(result => {
                return result.rows;
            })
        };
    });
}
exports.ContarHorasByCargo = function (id_empleado, desde, hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let ids = yield UltimoCargoContrato(id_empleado, desde); //devuelve los IDs de contrato y cargo, ademas del horarios o los horarios que el usuario ingreso.
        console.log(ids);
        if (ids.message)
            return ids;
        let horaIngresoEmpl = yield Promise.all(ids.map((obj) => __awaiter(this, void 0, void 0, function* () {
            console.log(obj);
            return yield DetalleHorario(obj.id_horarios).then(result => {
                return result;
            });
        })));
        console.log('IhorarioLaboral===');
        horaIngresoEmpl.forEach(obj => {
            console.log(obj);
        });
        const empleado = yield ObtenerInformacionEmpleado(id_empleado);
        const DetalleConsolidado = yield MetodoModelarDetalleAsistencia(id_empleado, desde, hasta, horaIngresoEmpl, ids[0].id_cargo);
        // console.log(DetalleConsolidado);
        const total = yield CalcularTotal(DetalleConsolidado);
        // console.log(total);
        let ReporteConsolidadoJsop = {
            empleado: [empleado],
            detalle: DetalleConsolidado,
            operaciones: total
        };
        return ReporteConsolidadoJsop;
        // return 0
    });
};
function CalcularTotal(arr) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataDecimal = {
            atraso: null || 0,
            sal_antes: null || 0,
            almuerzo: null || 0,
            hora_trab: null || 0,
            hora_supl: null || 0,
            hora_ex_L_V: null || 0,
            hora_ex_S_D: null || 0
        };
        arr.forEach((obj) => {
            dataDecimal.atraso = HHMMtoHorasDecimal(obj.atraso) + dataDecimal.atraso;
            dataDecimal.sal_antes = HHMMtoHorasDecimal(obj.sal_antes) + dataDecimal.sal_antes;
            dataDecimal.almuerzo = HHMMtoHorasDecimal(obj.almuerzo) + dataDecimal.almuerzo;
            dataDecimal.hora_trab = HHMMtoHorasDecimal(obj.hora_trab) + dataDecimal.hora_trab;
            dataDecimal.hora_supl = HHMMtoHorasDecimal(obj.hora_supl) + dataDecimal.hora_supl;
            dataDecimal.hora_ex_L_V = HHMMtoHorasDecimal(obj.hora_ex_L_V) + dataDecimal.hora_ex_L_V;
            dataDecimal.hora_ex_S_D = HHMMtoHorasDecimal(obj.hora_ex_S_D) + dataDecimal.hora_ex_S_D;
        });
        let dataHHMM = {
            atraso: HorasDecimalToHHMM(dataDecimal.atraso),
            sal_antes: HorasDecimalToHHMM(dataDecimal.sal_antes),
            almuerzo: HorasDecimalToHHMM(dataDecimal.almuerzo),
            hora_trab: HorasDecimalToHHMM(dataDecimal.hora_trab),
            hora_supl: HorasDecimalToHHMM(dataDecimal.hora_supl),
            hora_ex_L_V: HorasDecimalToHHMM(dataDecimal.hora_ex_L_V),
            hora_ex_S_D: HorasDecimalToHHMM(dataDecimal.hora_ex_S_D)
        };
        // console.log(dataDecimal);
        // console.log(dataHHMM);
        return [{
                decimal: dataDecimal,
                HHMM: dataHHMM
            }];
    });
}
function ObtenerInformacionEmpleado(id_empleado) {
    return __awaiter(this, void 0, void 0, function* () {
        let ObjetoEmpleado = {
            nombre: '',
            ciudad: '',
            cedula: '',
            codigo: '',
        };
        let data = yield database_1.default.query('SELECT e.nombre, e.apellido, e.cedula, e.codigo, c.descripcion FROM empleados AS e, empl_contratos AS co, empl_cargos AS ca, sucursales AS s, ciudades AS c WHERE e.id = $1 AND e.id = co.id_empleado AND ca.id_empl_contrato = co.id AND s.id = ca.id_sucursal AND s.id_ciudad = c.id ORDER BY co.fec_ingreso DESC LIMIT 1', [id_empleado])
            .then(result => {
            return result.rows[0];
        });
        ObjetoEmpleado.nombre = data.nombre + ' ' + data.apellido;
        ObjetoEmpleado.ciudad = data.descripcion;
        ObjetoEmpleado.cedula = data.cedula;
        ObjetoEmpleado.codigo = data.codigo;
        return ObjetoEmpleado;
    });
}
function tipoHorario(inicio, final) {
    var fecha1 = moment_1.default(inicio.toJSON().split("T")[0]);
    var fecha2 = moment_1.default(final.toJSON().split("T")[0]);
    var diasHorario = fecha2.diff(fecha1, 'days');
    if (diasHorario >= 1 && diasHorario <= 7)
        return 'semanal';
    if (diasHorario >= 25 && diasHorario <= 35)
        return 'mensual';
    return 'anual';
    /**
     * semana = 6 (mayor a 1 menor a 7),
     * mensual (mayor a 25 y menor a 35)
     * anual = 365 (Hacer que sea mayor 40 y menor a 370)
     */
}
/**********************************************
 *
 *      METODO PARA REGISTRAR ASISTENCIA.
 *
 ***********************************************/
exports.RegistrarAsistenciaByTimbres = function () {
    return __awaiter(this, void 0, void 0, function* () {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            var f = new Date();
            let hora = f.getHours();
            console.log(f.toString());
            console.log('======================================');
            if (hora === HORA_EJECUTA_PROCESO) {
                f.setUTCHours(f.getHours());
                f.setDate(f.getDate() - 5); // para realizar pruebas
                let hoy = f.toJSON().split("T")[0];
                // let rango_dias = ObtenerRango();
                // console.log(rango_dias);
                let timbresEmpleado = yield ListaTimbresDiarioToEmpleado(hoy);
                console.log(timbresEmpleado);
            }
            console.log('======================================');
        }), 1000000);
    });
};
