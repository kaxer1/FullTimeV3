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
exports.ModelarTiempoJornada = exports.ModelarAtrasos = exports.BuscarTimbresEoSModelado = exports.BuscarTimbresEoS = exports.SumarValoresArray = exports.HHMMtoHorasDecimal = exports.HoraExtra_ModelarDatos = exports.BuscarHorasExtras = exports.BuscarTimbresByCodigo_Fecha = exports.BuscarHorariosActivos = exports.BuscarTimbresByFecha = void 0;
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
                const hora_inicio = exports.HHMMtoHorasDecimal(f1.toJSON().split('T')[1].split('.')[0]);
                const hora_final = exports.HHMMtoHorasDecimal(f2.toJSON().split('T')[1].split('.')[0]);
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                return {
                    id_empl_cargo: obj.id_empl_cargo,
                    hora_inicio: hora_inicio,
                    hora_final: hora_final,
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: exports.HHMMtoHorasDecimal(obj.num_hora),
                    tiempo_autorizado: exports.HHMMtoHorasDecimal(obj.tiempo_autorizado),
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
                const hora_inicio = exports.HHMMtoHorasDecimal(f1.toJSON().split('T')[1].split('.')[0]);
                const hora_final = exports.HHMMtoHorasDecimal(f2.toJSON().split('T')[1].split('.')[0]);
                f1.setUTCHours(f1.getUTCHours() - 5);
                f2.setUTCHours(f2.getUTCHours() - 5);
                return {
                    id_empl_cargo: obj.id_empl_cargo,
                    hora_inicio: hora_inicio,
                    hora_final: hora_final,
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: exports.HHMMtoHorasDecimal(obj.horas_totales),
                    tiempo_autorizado: exports.HHMMtoHorasDecimal(obj.tiempo_autorizado),
                    codigo: obj.codigo
                };
            })));
        });
    });
}
exports.HHMMtoHorasDecimal = function (dato) {
    if (dato === '')
        return 0;
    if (dato === null)
        return 0;
    // if (dato === 0) return 0
    // console.log(dato);
    var h = parseInt(dato.split(':')[0]);
    var m = parseInt(dato.split(':')[1]) / 60;
    var s = parseInt(dato.split(':')[2]) / 3600;
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
                    obj1.fec_hora_timbre = exports.HHMMtoHorasDecimal(obj1.fec_hora_timbre.split(' ')[1]);
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
            var timbre = exports.HHMMtoHorasDecimal(obj.fec_hora_timbre.split(' ')[1]);
            var hora = exports.HHMMtoHorasDecimal(ele.hora) + ele.minu_espera / 60;
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
            var timbre = exports.HHMMtoHorasDecimal(obj.fec_hora_timbre.split(' ')[1]);
            var hora = exports.HHMMtoHorasDecimal(ele.hora) + ele.minu_espera / 60;
            (timbre > hora) ? retraso = true : retraso = false;
            return {
                fecha: obj.fec_hora_timbre,
                retraso: retraso
            };
        })[0];
    });
};
