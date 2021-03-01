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
exports.Empleado_Atrasos_ModelarDatos = exports.Empleado_Permisos_ModelarDatos = exports.Empleado_Vacaciones_ModelarDatos = exports.Empleado_HoraExtra_ModelarDatos = exports.ModelarSalidasAnticipadas = exports.ModelarTiempoJornada = exports.ModelarAtrasos = exports.BuscarTimbresEoSModelado = exports.BuscarTimbresEoS = exports.SumarValoresArray = exports.HHMMtoSegundos = exports.HoraExtra_ModelarDatos = exports.BuscarHorasExtras = exports.BuscarTimbresByCodigo_Fecha = exports.BuscarHorariosActivos = exports.BuscarTimbresByFecha = void 0;
const database_1 = __importDefault(require("../database"));
const moment_1 = __importDefault(require("moment"));
const MetodosHorario_1 = require("./MetodosHorario");
exports.BuscarTimbresByFecha = function (fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' ORDER BY fec_hora_timbre ASC', [fec_inicio, fec_final])
            .then(res => {
            return res.rows;
        });
    });
};
exports.BuscarHorariosActivos = function (fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        let lista_horarios = yield database_1.default.query('SELECT * FROM empl_horarios WHERE CAST(fec_inicio AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' ORDER BY fec_inicio ASC', [fec_inicio, fec_final])
            .then(res => {
            return res.rows;
        });
        let array = lista_horarios.map(obj => {
            return {
                horario: MetodosHorario_1.HorariosParaInasistencias(obj),
                codigo: obj.codigo
            };
        });
        lista_horarios = [];
        return array;
    });
};
exports.BuscarTimbresByCodigo_Fecha = function (codigo, horario) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(horario.map((obj) => __awaiter(this, void 0, void 0, function* () {
            return yield database_1.default.query('SELECT fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 ORDER BY fec_hora_timbre ASC', [obj.fecha, codigo])
                .then(res => {
                return {
                    fecha: obj.fecha,
                    timbresTotal: res.rowCount
                };
            });
        })));
    });
};
exports.BuscarHorasExtras = function (fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT fec_hora_timbre FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' ORDER BY fec_hora_timbre ASC', [fec_inicio, fec_final])
            .then(res => {
            return res.rows;
        });
    });
};
exports.HoraExtra_ModelarDatos = function (fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let horas_extras = yield ListaHorasExtrasGrafica(fec_desde, fec_hasta);
        // console.log('Lista de horas extras ===', horas_extras);
        let array = horas_extras.map((obj) => {
            (obj.tiempo_autorizado === 0) ? obj.tiempo_autorizado = obj.num_hora : obj.tiempo_autorizado = obj.tiempo_autorizado;
            return obj;
        });
        // console.log('Lista de array ===', array);
        let nuevo = [];
        array.forEach(obj => {
            let respuesta = DiasIterados(obj.fec_inicio, obj.fec_final, obj.tiempo_autorizado, obj.id_empl_cargo, obj.codigo);
            respuesta.forEach(ele => {
                nuevo.push(ele);
            });
        });
        // console.log('Lista de Nuevo ===', nuevo);    
        return nuevo;
    });
};
function DiasIterados(inicio, final, tiempo_autorizado, id_empl_cargo, codigo) {
    var fec_aux = new Date(inicio);
    var fecha1 = moment_1.default(inicio.split("T")[0]);
    var fecha2 = moment_1.default(final.split("T")[0]);
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
        respuesta.push(horario_res);
        fec_aux.setDate(fec_aux.getDate() + 1);
    }
    return respuesta;
}
function ListaHorasExtrasGrafica(fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let arrayUno = yield HorasExtrasSolicitadasGrafica(fec_desde, fec_hasta);
        let arrayDos = yield PlanificacionHorasExtrasSolicitadasGrafica(fec_desde, fec_hasta);
        // let arrayUnido  = [...new Set(arrayUno.concat(arrayDos))];  
        let arrayUnido = arrayUno.concat(arrayDos);
        let set = new Set(arrayUnido.map(obj => { return JSON.stringify(obj); }));
        arrayUnido = Array.from(set).map(obj => { return JSON.parse(obj); });
        for (let j = 0; j < arrayUnido.length; j++) {
            let numMin;
            let i = numMin = j;
            for (++i; i < arrayUnido.length; i++) {
                (arrayUnido[i].fec_inicio < arrayUnido[numMin].fec_inicio) && (numMin = i);
            }
            [arrayUnido[j], arrayUnido[numMin]] = [arrayUnido[numMin], arrayUnido[j]];
        }
        return arrayUnido;
    });
}
function HorasExtrasSolicitadasGrafica(fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT h.fec_inicio, h.fec_final, h.descripcion, h.num_hora, h.tiempo_autorizado, h.codigo, h.id_empl_cargo ' +
            'FROM hora_extr_pedidos AS h WHERE h.fec_inicio between $1 and $2 AND h.estado = 3 ' + // estado = 3 significa q las horas extras fueron autorizadas
            'AND h.fec_final between $1 and $2 ORDER BY h.fec_inicio', [fec_desde, fec_hasta])
            .then(result => {
            return Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                var f1 = new Date(obj.fec_inicio);
                var f2 = new Date(obj.fec_final);
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                const hora_inicio = exports.HHMMtoSegundos(f1.toJSON().split('T')[1].split('.')[0]) / 3600;
                const hora_final = exports.HHMMtoSegundos(f2.toJSON().split('T')[1].split('.')[0]) / 3600;
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                return {
                    id_empl_cargo: obj.id_empl_cargo,
                    hora_inicio: hora_inicio,
                    hora_final: hora_final,
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: exports.HHMMtoSegundos(obj.num_hora) / 3600,
                    tiempo_autorizado: exports.HHMMtoSegundos(obj.tiempo_autorizado) / 3600,
                    codigo: obj.codigo
                };
            })));
        });
    });
}
function PlanificacionHorasExtrasSolicitadasGrafica(fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT h.fecha_desde, h.hora_inicio, h.fecha_hasta, h.hora_fin, h.descripcion, h.horas_totales, ph.tiempo_autorizado, ph.codigo, ph.id_empl_cargo ' +
            'FROM plan_hora_extra_empleado AS ph, plan_hora_extra AS h WHERE ph.id_plan_hora = h.id AND ph.estado = 3 ' + //estado = 3 para horas extras autorizadas
            'AND h.fecha_desde between $1 and $2 AND h.fecha_hasta between $1 and $2 ORDER BY h.fecha_desde', [fec_desde, fec_hasta])
            .then(result => {
            return Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                var f1 = new Date(obj.fecha_desde.toJSON().split('T')[0] + 'T' + obj.hora_inicio);
                var f2 = new Date(obj.fecha_hasta.toJSON().split('T')[0] + 'T' + obj.hora_fin);
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                const hora_inicio = exports.HHMMtoSegundos(f1.toJSON().split('T')[1].split('.')[0]) / 3600;
                const hora_final = exports.HHMMtoSegundos(f2.toJSON().split('T')[1].split('.')[0]) / 3600;
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                return {
                    id_empl_cargo: obj.id_empl_cargo,
                    hora_inicio: hora_inicio,
                    hora_final: hora_final,
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: exports.HHMMtoSegundos(obj.horas_totales) / 3600,
                    tiempo_autorizado: exports.HHMMtoSegundos(obj.tiempo_autorizado) / 3600,
                    codigo: obj.codigo
                };
            })));
        });
    });
}
exports.HHMMtoSegundos = function (dato) {
    if (dato === '')
        return 0;
    if (dato === null)
        return 0;
    // if (dato === 0) return 0
    // console.log(dato);
    var h = parseInt(dato.split(':')[0]) * 3600;
    var m = parseInt(dato.split(':')[1]) * 60;
    var s = parseInt(dato.split(':')[2]);
    // console.log(h, '>>>>>', m);
    return h + m + s;
};
exports.SumarValoresArray = function (array) {
    let valor = 0;
    for (let i = 0; i < array.length; i++) {
        valor = valor + parseFloat(array[i]);
    }
    return valor.toFixed(2);
};
exports.BuscarTimbresEoS = function (fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion = $3 ORDER BY fec_hora_timbre ASC ', [fec_inicio, fec_final, 'EoS'])
            .then(res => {
            return res.rows;
        });
    });
};
exports.BuscarTimbresEoSModelado = function (fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        var fec_aux = new Date(fec_inicio);
        var fecha1 = moment_1.default(fec_inicio);
        var fecha2 = moment_1.default(fec_final);
        var diasHorario = fecha2.diff(fecha1, 'days');
        let fechas_consulta = [];
        for (let i = 0; i <= diasHorario; i++) {
            fechas_consulta.push({ fecha: fec_aux.toJSON().split('T')[0] });
            fec_aux.setDate(fec_aux.getDate() + 1);
        }
        let codigos = yield database_1.default.query('SELECT Distinct id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion = $3 ORDER BY id_empleado ASC ', [fec_inicio, fec_final, 'EoS'])
            .then(res => {
            return res.rows;
        });
        let nuevo = yield Promise.all(codigos.map((obj) => __awaiter(this, void 0, void 0, function* () {
            let arr = yield Promise.all(fechas_consulta.map((ele) => __awaiter(this, void 0, void 0, function* () {
                return {
                    fecha: ele.fecha,
                    registros: yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), tecl_funcion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 AND accion = $3 ORDER BY fec_hora_timbre ASC ', [ele.fecha, obj.id_empleado, 'EoS'])
                        .then(res => {
                        return res.rows;
                    })
                };
            })));
            return {
                id_empleado: obj.id_empleado,
                timbres: arr,
                respuesta: new Array,
                horario: yield database_1.default.query('SELECT dh.hora, dh.orden FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
                    'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' +
                    'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden in (1, 4)', [obj.id_empleado, fec_inicio, fec_final])
                    .then(res => {
                    return res.rows;
                })
            };
        })));
        nuevo.forEach((obj) => {
            obj.timbres = obj.timbres.filter((ele) => {
                return (ele.registros != 0);
            }).map((ele) => {
                ele.registros.forEach((obj1) => {
                    obj1.fec_hora_timbre = exports.HHMMtoSegundos(obj1.fec_hora_timbre.split(' ')[1]) / 3600;
                });
                return ele;
            });
            let set = new Set(obj.horario.map((nue) => { return JSON.stringify(nue); }));
            console.log(set);
            obj.horario = Array.from(set).map((nue) => { return JSON.parse(nue); });
        });
        return nuevo;
    });
};
exports.ModelarAtrasos = function (obj, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(obj);
        let array = yield database_1.default.query('SELECT dh.hora, dh.minu_espera FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
            'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' +
            'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden = 1 limit 1', [obj.id_empleado, fec_inicio, fec_final])
            .then(res => { return res.rows; });
        // console.log('Array del resultado',array);
        if (array.length === 0) {
            return {
                fecha: obj.fec_hora_timbre,
                retraso: false
            };
        }
        return array.map(ele => {
            let retraso = false;
            var timbre = exports.HHMMtoSegundos(obj.fec_hora_timbre.split(' ')[1]);
            var hora = exports.HHMMtoSegundos(ele.hora) + ele.minu_espera * 60;
            (timbre > hora) ? retraso = true : retraso = false;
            return {
                fecha: obj.fec_hora_timbre,
                retraso: retraso
            };
        })[0];
    });
};
exports.ModelarTiempoJornada = function (obj, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(obj);
        let array = yield database_1.default.query('SELECT dh.hora, dh.orden FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
            'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' +
            'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden in (1, 4) ', [obj.id_empleado, fec_inicio, fec_final])
            .then(res => { return res.rows; });
        // console.log('Array del resultado',array);
        if (array.length === 0) {
            return {
                fecha: obj.fec_hora_timbre,
                retraso: false
            };
        }
        return array.map(ele => {
            let retraso = false;
            var timbre = exports.HHMMtoSegundos(obj.fec_hora_timbre.split(' ')[1]);
            var hora = exports.HHMMtoSegundos(ele.hora) + ele.minu_espera / 60;
            (timbre > hora) ? retraso = true : retraso = false;
            return {
                fecha: obj.fec_hora_timbre,
                retraso: retraso
            };
        })[0];
    });
};
exports.ModelarSalidasAnticipadas = function (fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(obj);
        let timbres = yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion in (\'EoS\') ORDER BY fec_hora_timbre ASC', [fec_inicio, fec_final])
            .then(res => {
            return res.rows;
        });
        let nuevo = yield Promise.all(timbres.map((obj) => __awaiter(this, void 0, void 0, function* () {
            var f = new Date(obj.fec_hora_timbre);
            return {
                fecha: obj.fec_hora_timbre.split(' ')[0],
                hora_timbre: obj.fec_hora_timbre.split(' ')[1],
                codigo: obj.id_empleado,
                diferencia_tiempo: 0,
                hora_salida: yield database_1.default.query('SELECT dt.hora FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dt ' +
                    'WHERE eh.fec_inicio < $1 AND eh.fec_final > $1 AND eh.codigo = $2 AND h.id = eh.id_horarios ' +
                    'AND dt.id_horario = h.id AND dt.orden = 4', [f, obj.id_empleado])
                    .then(res => {
                    return res.rows;
                })
            };
        })));
        timbres = [];
        let array = nuevo.filter(obj => {
            return obj.hora_salida.length != 0;
        }).map((obj) => {
            obj.hora_timbre = exports.HHMMtoSegundos(obj.hora_timbre) / 3600;
            obj.hora_salida = exports.HHMMtoSegundos(obj.hora_salida[0].hora) / 3600;
            return obj;
        }).filter(obj => {
            var rango_inicio = obj.hora_salida - 3;
            obj.diferencia_tiempo = obj.hora_salida - obj.hora_timbre;
            return rango_inicio <= obj.hora_timbre && obj.hora_salida > obj.hora_timbre;
        });
        nuevo = [];
        return array;
    });
};
/**
 * SUBMETODOS PARA LAS GRAFICAS DE EMPLEADOS INDIVIDUALEMTNE
 */
exports.Empleado_HoraExtra_ModelarDatos = function (codigo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let horas_extras = yield EmpleadoHorasExtrasGrafica(codigo, fec_desde, fec_hasta);
        console.log('Lista de horas extras ===', horas_extras);
        let array = horas_extras.map((obj) => {
            (obj.tiempo_autorizado === 0) ? obj.tiempo_autorizado = obj.num_hora : obj.tiempo_autorizado = obj.tiempo_autorizado;
            return obj;
        });
        // console.log('Lista de array ===', array);
        let nuevo = [];
        array.forEach(obj => {
            let respuesta = DiasIterados(obj.fec_inicio, obj.fec_final, obj.tiempo_autorizado, obj.id_empl_cargo, obj.codigo);
            respuesta.forEach(ele => {
                nuevo.push(ele);
            });
        });
        // console.log('Lista de Nuevo ===', nuevo);    
        return nuevo;
    });
};
function EmpleadoHorasExtrasGrafica(codigo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let arrayUno = yield EmpleadoHorasExtrasSolicitadasGrafica(codigo, fec_desde, fec_hasta);
        let arrayDos = yield EmpleadoPlanificacionHorasExtrasSolicitadasGrafica(codigo, fec_desde, fec_hasta);
        // let arrayUnido  = [...new Set(arrayUno.concat(arrayDos))];  
        let arrayUnido = arrayUno.concat(arrayDos);
        let set = new Set(arrayUnido.map(obj => { return JSON.stringify(obj); }));
        arrayUnido = Array.from(set).map(obj => { return JSON.parse(obj); });
        for (let j = 0; j < arrayUnido.length; j++) {
            let numMin;
            let i = numMin = j;
            for (++i; i < arrayUnido.length; i++) {
                (arrayUnido[i].fec_inicio < arrayUnido[numMin].fec_inicio) && (numMin = i);
            }
            [arrayUnido[j], arrayUnido[numMin]] = [arrayUnido[numMin], arrayUnido[j]];
        }
        return arrayUnido;
    });
}
function EmpleadoHorasExtrasSolicitadasGrafica(codigo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT h.fec_inicio, h.fec_final, h.descripcion, h.num_hora, h.tiempo_autorizado, h.codigo, h.id_empl_cargo ' +
            'FROM hora_extr_pedidos AS h WHERE h.fec_inicio between $1 and $2 AND h.estado = 3 ' + // estado = 3 significa q las horas extras fueron autorizadas
            'AND h.fec_final between $1 and $2 AND h.codigo = $3 ORDER BY h.fec_inicio', [fec_desde, fec_hasta, codigo])
            .then(result => {
            return Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                var f1 = new Date(obj.fec_inicio);
                var f2 = new Date(obj.fec_final);
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                const hora_inicio = exports.HHMMtoSegundos(f1.toJSON().split('T')[1].split('.')[0]) / 3600;
                const hora_final = exports.HHMMtoSegundos(f2.toJSON().split('T')[1].split('.')[0]) / 3600;
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                return {
                    id_empl_cargo: obj.id_empl_cargo,
                    hora_inicio: hora_inicio,
                    hora_final: hora_final,
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: exports.HHMMtoSegundos(obj.num_hora) / 3600,
                    tiempo_autorizado: exports.HHMMtoSegundos(obj.tiempo_autorizado) / 3600,
                    codigo: obj.codigo
                };
            })));
        });
    });
}
function EmpleadoPlanificacionHorasExtrasSolicitadasGrafica(codigo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT h.fecha_desde, h.hora_inicio, h.fecha_hasta, h.hora_fin, h.descripcion, h.horas_totales, ph.tiempo_autorizado, ph.codigo, ph.id_empl_cargo ' +
            'FROM plan_hora_extra_empleado AS ph, plan_hora_extra AS h WHERE ph.id_plan_hora = h.id AND ph.estado = 3 ' + //estado = 3 para horas extras autorizadas
            'AND h.fecha_desde between $1 and $2 AND h.fecha_hasta between $1 and $2 AND ph.codigo = $3 ORDER BY h.fecha_desde', [fec_desde, fec_hasta, codigo])
            .then(result => {
            return Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                var f1 = new Date(obj.fecha_desde.toJSON().split('T')[0] + 'T' + obj.hora_inicio);
                var f2 = new Date(obj.fecha_hasta.toJSON().split('T')[0] + 'T' + obj.hora_fin);
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                const hora_inicio = exports.HHMMtoSegundos(f1.toJSON().split('T')[1].split('.')[0]) / 3600;
                const hora_final = exports.HHMMtoSegundos(f2.toJSON().split('T')[1].split('.')[0]) / 3600;
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                return {
                    id_empl_cargo: obj.id_empl_cargo,
                    hora_inicio: hora_inicio,
                    hora_final: hora_final,
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: exports.HHMMtoSegundos(obj.horas_totales) / 3600,
                    tiempo_autorizado: exports.HHMMtoSegundos(obj.tiempo_autorizado) / 3600,
                    codigo: obj.codigo
                };
            })));
        });
    });
}
exports.Empleado_Vacaciones_ModelarDatos = function (codigo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let vacaciones = yield database_1.default.query('SELECT CAST(fec_inicio AS VARCHAR), CAST(fec_final AS VARCHAR) FROM vacaciones WHERE codigo = $1 AND fec_inicio between $2 and $3 AND estado = 3 ', [codigo, fec_desde, fec_hasta]).then(result => { return result.rows; });
        // console.log('Lista de vacaciones ===', vacaciones);
        let aux_array = [];
        vacaciones.forEach(obj => {
            var fec_aux = new Date(obj.fec_inicio);
            var fecha1 = moment_1.default(obj.fec_inicio.split(" ")[0]);
            var fecha2 = moment_1.default(obj.fec_final.split(" ")[0]);
            var diasHorario = fecha2.diff(fecha1, 'days') + 1;
            for (let i = 0; i < diasHorario; i++) {
                let horario_res = {
                    fecha: fec_aux.toJSON().split('T')[0],
                    n_dia: 1
                };
                aux_array.push(horario_res);
                fec_aux.setDate(fec_aux.getDate() + 1);
            }
        });
        // console.log('Lista array fechas: ',aux_array);    
        return aux_array;
    });
};
exports.Empleado_Permisos_ModelarDatos = function (codigo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let permisos = yield database_1.default.query('SELECT CAST(fec_inicio AS VARCHAR), CAST(fec_final AS VARCHAR), hora_numero, dia FROM permisos WHERE codigo = $1 AND fec_inicio between $2 and $3 AND estado = 3 ', [codigo, fec_desde, fec_hasta]).then(result => { return result.rows; });
        // console.log('Lista de permisos ===', permisos);
        let aux_array = [];
        permisos.forEach(obj => {
            var fec_aux = new Date(obj.fec_inicio);
            var fecha1 = moment_1.default(obj.fec_inicio.split(" ")[0]);
            var fecha2 = moment_1.default(obj.fec_final.split(" ")[0]);
            var diasHorario = fecha2.diff(fecha1, 'days') + 1;
            for (let i = 0; i < diasHorario; i++) {
                let horario_res = {
                    fecha: fec_aux.toJSON().split('T')[0],
                    tiempo: (obj.dia + (exports.HHMMtoSegundos(obj.hora_numero) / 3600)) / diasHorario,
                };
                aux_array.push(horario_res);
                fec_aux.setDate(fec_aux.getDate() + 1);
            }
        });
        // console.log('Lista array fechas: ',aux_array);    
        return aux_array;
    });
};
exports.Empleado_Atrasos_ModelarDatos = function (codigo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let timbres = yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion = $3 AND id_empleado = $4 ORDER BY fec_hora_timbre ASC ', [fec_desde, fec_hasta, 'EoS', codigo])
            .then(res => {
            return res.rows;
        });
        // console.log('Lista de timbres ===', timbres);
        let array = yield Promise.all(timbres.map((obj) => __awaiter(this, void 0, void 0, function* () {
            return yield exports.ModelarAtrasos(obj, fec_desde.toJSON().split('T')[0], fec_hasta.toJSON().split('T')[0]);
        })));
        // console.log('ARRAY ===', array);
        return array;
    });
};
