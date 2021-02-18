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
const database_1 = __importDefault(require("../../database"));
const SubMetodosGraficas_1 = require("../../libs/SubMetodosGraficas");
const MetodosHorario_1 = require("../../libs/MetodosHorario");
const moment_1 = __importDefault(require("moment"));
class ReportesAsistenciaControlador {
    Departamentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let estado = req.params.estado;
            console.log('Estado: ', estado);
            let suc = yield database_1.default.query('SELECT s.id AS id_suc, s.nombre AS name_suc, c.descripcion AS ciudad FROM sucursales AS s, ciudades AS c WHERE s.id_ciudad = c.id ORDER BY s.id')
                .then(result => { return result.rows; });
            if (suc.length === 0)
                return res.status(404).jsonp({ message: 'No tiene sucursales registrados' });
            let departamentos = yield Promise.all(suc.map((ele) => __awaiter(this, void 0, void 0, function* () {
                ele.departamentos = yield database_1.default.query('SELECT d.id as id_depa, d.nombre as name_dep FROM cg_departamentos AS d ' +
                    'WHERE d.id_sucursal = $1', [ele.id_suc])
                    .then(result => {
                    return result.rows.filter(obj => {
                        return obj.name_dep != 'Ninguno';
                    });
                });
                return ele;
            })));
            let depa = departamentos.filter(obj => {
                return obj.departamentos.length > 0;
            });
            if (depa.length === 0)
                return res.status(404).jsonp({ message: 'No tiene departamentos registrados' });
            let lista = yield Promise.all(depa.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield database_1.default.query('SELECT DISTINCT e.id, CONCAT(nombre, \' \', apellido) name_empleado, e.codigo, e.cedula, e.genero FROM empl_cargos AS ca, empl_contratos AS co, cg_regimenes AS r, empleados AS e ' +
                        'WHERE ca.id_departamento = $1 AND ca.id_empl_contrato = co.id AND co.id_regimen = r.id AND co.id_empleado = e.id AND e.estado = $2', [ele.id_depa, estado])
                        .then(result => { return result.rows; });
                    return ele;
                })));
                return obj;
            })));
            if (lista.length === 0)
                return res.status(404).jsonp({ message: 'No tiene empleados asignados a los departamentos' });
            let respuesta = lista.map(obj => {
                obj.departamentos = obj.departamentos.filter((ele) => {
                    return ele.empleado.length > 0;
                });
                return obj;
            }).filter(obj => {
                return obj.departamentos.length > 0;
            });
            if (respuesta.length === 0)
                return res.status(404).jsonp({ message: 'No tiene departamentos con empleados' });
            res.status(200).jsonp(respuesta);
        });
    }
    ReporteAtrasosMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            // console.log(datos);
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        let timbres = yield BuscarTimbresEoSReporte(desde, hasta, o.codigo);
                        o.timbres = yield Promise.all(timbres.map((e) => __awaiter(this, void 0, void 0, function* () {
                            return yield ModelarAtrasosReporte(e);
                        })));
                        console.log(o);
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.map((t) => {
                        t.timbres = t.timbres.filter((a) => { return a != 0; });
                        return t;
                    }).filter((t) => { return t.timbres.length > 0; });
                    console.log('Empleados: ', e);
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay atrasos de empleados en ese periodo' });
            return res.status(200).jsonp(nuevo);
        });
    }
    ReporteFaltasMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            console.log(desde, hasta);
            let datos = req.body;
            console.log(datos);
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        let faltas = yield BuscarHorarioEmpleado(desde, hasta, o.codigo);
                        o.faltas = faltas.filter(o => {
                            return o.registros === 0;
                        }).map(o => {
                            return { fecha: o.fecha };
                        });
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((t) => { return t.faltas.length > 0; });
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay faltas de empleados en ese periodo' });
            return res.status(200).jsonp(nuevo);
        });
    }
    ReporteFaltasMultipleTabulado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            // console.log(datos);
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                        o.cargo = yield database_1.default.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                        let faltas = yield BuscarHorarioEmpleado(desde, hasta, o.codigo);
                        o.faltas = faltas.filter(o => {
                            return o.registros === 0;
                        }).map(o => {
                            return { fecha: o.fecha };
                        });
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((t) => { return t.faltas.length > 0; });
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay faltas de empleados en ese periodo' });
            return res.status(200).jsonp(nuevo);
        });
    }
    ReporteHorasTrabajaMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            console.log(desde, hasta);
            let datos = req.body;
            console.log(datos);
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.timbres = yield ModelarHorasTrabajaReporte(o.codigo, desde, hasta);
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((t) => { return t.timbres.length > 0; });
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay atrasos de empleados en ese periodo' });
            return res.status(200).jsonp(datos);
        });
    }
    ReportePuntualidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            let params_query = req.query;
            // console.log(params_query);        
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                        o.cargo = yield database_1.default.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                        let timbres = yield BuscarTimbresEoSReporte(desde, hasta, o.codigo);
                        // console.log('Return del timbre: ',timbres);
                        if (timbres.length === 0) {
                            o.puntualidad = 0;
                        }
                        else {
                            let aux = yield Promise.all(timbres.map((e) => __awaiter(this, void 0, void 0, function* () {
                                return yield ModelarPuntualidad(e);
                            })));
                            var array = [];
                            aux.forEach(u => {
                                if (u[0] > 0) {
                                    array.push(u[0]);
                                }
                            });
                            o.puntualidad = parseInt(SubMetodosGraficas_1.SumarValoresArray(array));
                            // console.log(o);
                        }
                        if (o.puntualidad >= parseInt(params_query.mayor)) {
                            o.color = '#06F313'; // verde
                        }
                        else if (o.puntualidad <= parseInt(params_query.menor)) {
                            o.color = '#EC2E05'; // rojo
                        }
                        else {
                            o.color = '#F38306'; // naranja
                        }
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            return res.status(200).jsonp(n);
        });
    }
    ReporteTimbresIncompletos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            console.log(desde, hasta);
            let datos = req.body;
            console.log(datos);
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                        o.cargo = yield database_1.default.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                        o.timbres = yield TimbresIncompletos(new Date(desde), new Date(hasta), o.codigo);
                        // console.log(o);
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((t) => { return t.timbres.length > 0; });
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay atrasos de empleados en ese periodo' });
            return res.status(200).jsonp(nuevo);
        });
    }
    ReporteTimbresTabulado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            // console.log(datos);
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                        o.cargo = yield database_1.default.query('SELECT ca.cargo FROM empl_contratos AS co, empl_cargos AS ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                        o.timbres = yield TimbresTabulados(desde, hasta, o.codigo);
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((t) => { return t.timbres.length > 0; });
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay atrasos de empleados en ese periodo' });
            return res.status(200).jsonp(nuevo);
        });
    }
    ReporteTimbresMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            console.log(datos);
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.timbres = yield BuscarTimbres(desde, hasta, o.codigo);
                        console.log(o);
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((t) => { return t.timbres.length > 0; });
                    // console.log('Empleados: ',e);
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay atrasos de empleados en ese periodo' });
            return res.status(200).jsonp(nuevo);
        });
    }
}
const REPORTE_A_CONTROLADOR = new ReportesAsistenciaControlador();
exports.default = REPORTE_A_CONTROLADOR;
const BuscarTimbresEoSReporte = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion = $3 AND id_empleado = $4 ORDER BY fec_hora_timbre ASC ', [fec_inicio, fec_final, 'EoS', codigo])
            .then(res => {
            return res.rows;
        });
    });
};
const BuscarTimbres = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_reloj, accion, observacion, latitud, longitud FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND id_empleado = $3 ORDER BY fec_hora_timbre ASC ', [fec_inicio, fec_final, codigo])
            .then(res => {
            return res.rows;
        });
    });
};
const ModelarAtrasosReporte = function (obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let array = yield database_1.default.query('SELECT dh.hora, dh.minu_espera FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
            'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND eh.fec_inicio <= $2 ' +
            'AND eh.fec_final >= $2 AND dh.orden = 1', [obj.id_empleado, new Date(obj.fec_hora_timbre.split(' ')[0])])
            .then(res => { return res.rows; });
        // let array = await pool.query('SELECT dh.hora, dh.minu_espera FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' + 
        // 'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' + 
        // 'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' AND dh.orden = 1 limit 1',[obj.id_empleado, fec_inicio, fec_final])
        // .then(res => { return res.rows})
        if (array.length === 0)
            return 0;
        // console.log('Hora entrada y minuto Atrasos',array);
        return array.map(ele => {
            let retraso = false;
            var timbre = SubMetodosGraficas_1.HHMMtoHorasDecimal(obj.fec_hora_timbre.split(' ')[1]);
            var hora = SubMetodosGraficas_1.HHMMtoHorasDecimal(ele.hora) + ele.minu_espera / 60;
            (timbre > hora) ? retraso = true : retraso = false;
            if (retraso === false)
                return 0;
            let diferencia = timbre - hora;
            if (diferencia > 4)
                return 0;
            return {
                horario: obj.fec_hora_timbre.split(' ')[0] + ' ' + ele.hora,
                timbre: obj.fec_hora_timbre.split(' ')[1],
                atraso_dec: diferencia.toFixed(2),
                atraso_HHMM: HorasDecimalToHHMM(diferencia),
            };
        })[0];
    });
};
const BuscarTimbresReporte = function (fecha, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), accion, observacion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 AND accion in (\'EoS\',\'AES\') ORDER BY fec_hora_timbre ASC ', [fecha, codigo])
            .then(res => {
            return res.rows;
        });
    });
};
const ModelarHorasTrabajaReporte = function (codigo, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        let array = yield database_1.default.query('SELECT DISTINCT dh.hora, dh.orden FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
            'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' +
            'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ', [codigo, fec_inicio, fec_final])
            .then(res => { return res.rows; });
        if (array.length === 0)
            return [];
        // console.log('horarios: ',array);
        var fec_aux = new Date(fec_inicio);
        var fecha1 = moment_1.default(fec_inicio);
        var fecha2 = moment_1.default(fec_final);
        var diasDiferencia = fecha2.diff(fecha1, 'days');
        let respuesta = [];
        for (let i = 0; i <= diasDiferencia; i++) {
            let horario_res = {
                fecha: fec_aux.toJSON().split('T')[0],
                timbres: yield BuscarTimbresReporte(fec_aux.toJSON().split('T')[0], codigo),
                horario: array
            };
            if (horario_res.timbres.length > 0) {
                respuesta.push(horario_res);
            }
            fec_aux.setDate(fec_aux.getDate() + 1);
        }
        let arr_respuesta = [];
        respuesta.forEach((o) => {
            let obj = {
                fecha: o.fecha,
                horarios: [],
                total_timbres: '',
                total_horario: '',
            };
            let arr_EoS = [];
            let arr_AES = [];
            let arr_horario_EoS = [];
            let arr_horario_AES = [];
            o.horario.forEach((h) => {
                let obj2 = {
                    hora_horario: h.hora,
                    hora_timbre: '',
                    accion: '',
                    observacion: ''
                };
                switch (h.orden) {
                    case 1:
                        var arr3 = o.timbres.filter((t) => { return t.accion === 'EoS'; });
                        if (arr3.length === 0) {
                            obj2.accion = 'EoS';
                            obj2.hora_timbre = h.hora;
                            obj2.observacion = 'Entrada';
                        }
                        else {
                            obj2.accion = arr3[0].accion;
                            obj2.observacion = arr3[0].observacion;
                            obj2.hora_timbre = arr3[0].fec_hora_timbre.split(' ')[1];
                        }
                        arr_horario_EoS.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_horario));
                        arr_EoS.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_timbre));
                        break;
                    case 2:
                        var arr4 = o.timbres.filter((t) => { return t.accion === 'AES'; });
                        if (arr4.length === 0) {
                            obj2.accion = 'AES';
                            obj2.hora_timbre = h.hora;
                            obj2.observacion = 'Salida Almuerzo';
                        }
                        else {
                            obj2.accion = arr4[0].accion;
                            obj2.observacion = arr4[0].observacion;
                            obj2.hora_timbre = arr4[0].fec_hora_timbre.split(' ')[1];
                        }
                        arr_horario_AES.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_horario));
                        arr_AES.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_timbre));
                        break;
                    case 3:
                        var arr1 = o.timbres.filter((t) => { return t.accion === 'AES'; });
                        if (arr1.length === 0) {
                            obj2.accion = 'AES';
                            obj2.hora_timbre = h.hora;
                            obj2.observacion = 'Entrada Almuerzo';
                        }
                        else {
                            obj2.accion = arr1[arr1.length - 1].accion;
                            obj2.observacion = arr1[arr1.length - 1].observacion;
                            obj2.hora_timbre = arr1[arr1.length - 1].fec_hora_timbre.split(' ')[1];
                        }
                        arr_horario_AES.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_horario));
                        arr_AES.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_timbre));
                        break;
                    case 4:
                        var arr2 = o.timbres.filter((t) => { return t.accion === 'EoS'; });
                        if (arr2.length === 0) {
                            obj2.accion = 'EoS';
                            obj2.hora_timbre = h.hora;
                            obj2.observacion = 'Salida';
                        }
                        else {
                            obj2.accion = arr2[arr2.length - 1].accion;
                            obj2.observacion = arr2[arr2.length - 1].observacion;
                            obj2.hora_timbre = arr2[arr2.length - 1].fec_hora_timbre.split(' ')[1];
                        }
                        arr_horario_EoS.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_horario));
                        arr_EoS.push(SubMetodosGraficas_1.HHMMtoHorasDecimal(obj2.hora_timbre));
                        break;
                    default:
                        break;
                }
                obj.horarios.push(obj2);
            });
            var resta_hor_EoS = parseFloat(arr_horario_EoS[1]) - parseFloat(arr_horario_EoS[0]);
            var resta_hor_AES = parseFloat(arr_horario_AES[1]) - parseFloat(arr_horario_AES[0]);
            let resta_hor = resta_hor_EoS - resta_hor_AES;
            obj.total_horario = HorasDecimalToHHMM(resta_hor);
            let resta_tim_EoS = parseFloat(arr_EoS[1]) - parseFloat(arr_EoS[0]);
            let resta_tim_AES = parseFloat(arr_AES[1]) - parseFloat(arr_AES[0]);
            let resta_tim = resta_tim_EoS - resta_tim_AES;
            obj.total_timbres = HorasDecimalToHHMM(resta_tim);
            arr_respuesta.push(obj);
        });
        respuesta = [];
        array = [];
        arr_respuesta.forEach((o) => {
            console.log('***************************');
            console.log(o);
            console.log('***************************');
        });
        return arr_respuesta;
    });
};
function HorasDecimalToHHMM(dato) {
    // console.log('Hora decimal a HHMM ======>',dato);
    var h = parseInt(dato.toString());
    var x = (dato - h) * 60;
    var m = parseInt(x.toString());
    if (h < 0) {
        return '00:00:00';
    }
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
    return hora + ':' + min + ':00';
}
function BuscarHorarioEmpleado(fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield database_1.default.query('SELECT * FROM empl_horarios WHERE CAST(fec_inicio as VARCHAR) between $1 and $2 AND CAST(fec_final as VARCHAR) between $1 and $2 ' +
            'AND codigo = $3 ORDER BY fec_inicio', [fec_inicio, fec_final, codigo]).then(result => { return result.rows; });
        if (res.length === 0)
            return res;
        let array = [];
        res.forEach(obj => {
            MetodosHorario_1.HorariosParaInasistencias(obj).forEach(o => {
                array.push(o);
            });
        });
        let timbres = yield Promise.all(array.map((o) => __awaiter(this, void 0, void 0, function* () {
            o.registros = yield database_1.default.query('SELECT count(*) FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' ', [o.fecha])
                .then(result => {
                if (result.rowCount === 0)
                    return parseInt('0');
                return parseInt(result.rows[0].count);
            });
            return o;
        })));
        return timbres;
    });
}
const ModelarPuntualidad = function (obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let array = yield database_1.default.query('SELECT DISTINCT eh.id, dh.hora FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
            'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND eh.fec_inicio <= $2 ' +
            'AND eh.fec_final >= $2 AND dh.orden = 1', [obj.id_empleado, new Date(obj.fec_hora_timbre.split(' ')[0])])
            .then(res => { return res.rows; });
        if (array.length === 0)
            return [0];
        // console.log('Hora entrada',array);
        return array.map(ele => {
            let puntual = false;
            var timbre = SubMetodosGraficas_1.HHMMtoHorasDecimal(obj.fec_hora_timbre.split(' ')[1]);
            var hora = SubMetodosGraficas_1.HHMMtoHorasDecimal(ele.hora);
            (timbre <= hora) ? puntual = true : puntual = false;
            if (puntual === false)
                return 0;
            let diferencia = hora - timbre;
            if (diferencia > 4)
                return 0; // para diferenciar las horas de salida
            return 1; // un dia puntual
        });
    });
};
const TimbresTabulados = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        let timbres = yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), accion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND id_empleado = $3 ORDER BY fec_hora_timbre ASC ', [fec_inicio, fec_final, codigo])
            .then(res => {
            return res.rows;
        });
        if (timbres.length === 0)
            return [];
        var nuevoArray = [];
        var arrayTemporal = [];
        for (var i = 0; i < timbres.length; i++) {
            arrayTemporal = nuevoArray.filter((res) => {
                return res["Fecha"] == timbres[i]["fec_hora_timbre"].split(' ')[0];
            });
            if (arrayTemporal.length > 0) {
                nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["Timbres"].push(timbres[i]);
            }
            else {
                nuevoArray.push({ "Fecha": timbres[i]["fec_hora_timbre"].split(' ')[0], "Timbres": [timbres[i]] });
            }
        }
        function compare(a, b) {
            var uno = new Date(a.Fecha);
            var dos = new Date(b.Fecha);
            if (uno < dos)
                return -1;
            if (uno > dos)
                return 1;
            return 0;
        }
        nuevoArray.sort(compare);
        let arrayModelado = [];
        nuevoArray.forEach((obj) => {
            let e = {
                fecha: obj.Fecha,
                entrada: obj.Timbres.filter((ele) => { return ele.accion === 'EoS'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                salida: obj.Timbres.filter((ele) => { return ele.accion === 'EoS'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[1],
                sal_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'AES'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                ent_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'AES'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[1],
                desconocido: obj.Timbres.filter((ele) => { return ele.accion != 'EoS' && ele.accion != 'AES'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0]
            };
            // console.log(e); 
            arrayModelado.push(e);
        });
        return arrayModelado;
    });
};
const TimbresIncompletos = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        let horarios = yield database_1.default.query('SELECT eh.fec_inicio, eh.fec_final, eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo, eh.codigo ' +
            'FROM empl_horarios AS eh WHERE eh.fec_inicio >= $1 AND eh.fec_final <= $2 AND eh.codigo = $3 ORDER BY eh.fec_inicio ASC', [fec_inicio, fec_final, codigo]).then(result => {
            return result.rows;
        });
        if (horarios.length === 0)
            return [];
        let hora_deta = yield Promise.all(horarios.map((obj) => __awaiter(this, void 0, void 0, function* () {
            obj.dias_laborados = MetodosHorario_1.HorariosParaInasistencias(obj);
            // obj.dias_laborados = ModelarFechas(obj.fec_inicio, obj.fec_final, obj)
            obj.deta_horarios = yield database_1.default.query('SELECT DISTINCT dh.hora, dh.orden, dh.tipo_accion FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
                'WHERE eh.id_horarios = h.id AND h.id = dh.id_horario AND eh.codigo = $1 ORDER BY dh.orden ASC', [obj.codigo]).then(result => {
                return result.rows;
            });
            return obj;
        })));
        if (hora_deta.length === 0)
            return [];
        let modelado = yield Promise.all(hora_deta.map((obj) => __awaiter(this, void 0, void 0, function* () {
            obj.dias_laborados = yield Promise.all(obj.dias_laborados.map((obj1) => __awaiter(this, void 0, void 0, function* () {
                return {
                    fecha: obj1.fecha,
                    timbres_hora: yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR) AS timbre, accion FROM timbres WHERE id_empleado = $1 AND CAST(fec_hora_timbre AS VARCHAR) like $2 || \'%\' AND accion in (\'EoS\',\'AES\')', [obj.codigo, obj1.fecha]).then(result => { return result.rows; })
                };
            })));
            obj.dias_laborados = obj.dias_laborados.map((o) => {
                if (o.timbres_hora.length === 0) {
                    o.timbres_hora = obj.deta_horarios.map((h) => {
                        return {
                            tipo: h.tipo_accion,
                            hora: h.hora
                        };
                    });
                    return o;
                }
                else {
                    o.timbres_hora = obj.deta_horarios.map((h) => {
                        var h_inicio = SubMetodosGraficas_1.HHMMtoHorasDecimal(h.hora) - SubMetodosGraficas_1.HHMMtoHorasDecimal('01:00:00');
                        var h_final = SubMetodosGraficas_1.HHMMtoHorasDecimal(h.hora) + SubMetodosGraficas_1.HHMMtoHorasDecimal('01:00:00');
                        let respuesta = o.timbres_hora.filter((t) => {
                            let hora_timbre = SubMetodosGraficas_1.HHMMtoHorasDecimal(t.timbre.split(' ')[1]);
                            return h_inicio <= hora_timbre && h_final >= hora_timbre;
                        });
                        // console.log('RESPUESTA TIMBRE ENCONTRADO: ', respuesta);
                        if (respuesta.length === 0) {
                            return {
                                tipo: h.tipo_accion,
                                hora: h.hora
                            };
                        }
                        return 0;
                    }).filter((h) => { return h != 0; });
                    return o;
                }
            });
            return obj;
        })));
        // modelado.forEach(obj => { console.log(obj.dias_laborados);})
        let res = [];
        modelado.forEach(obj => {
            obj.dias_laborados.filter((o) => {
                return o.timbres_hora.length > 0;
            }).map((o) => {
                res.push(o);
                return o;
            });
        });
        return res;
    });
};
function ModelarFechas(desde, hasta, horario) {
    let fechasRango = {
        inicio: desde,
        final: hasta
    };
    let objeto = DiasConEstado(horario, fechasRango);
    // console.log('Objeto JSON: ', objeto);
    return objeto.filter(obj => { return (obj.estado === false); }).map(obj => { return { fecha: obj.fecha }; });
}
function DiasConEstado(horario, rango) {
    var fec_aux = new Date(rango.inicio);
    var fecha1 = moment_1.default(rango.inicio);
    var fecha2 = moment_1.default(rango.final);
    var diasHorario = fecha2.diff(fecha1, 'days');
    let respuesta = [];
    for (let i = 0; i <= diasHorario; i++) {
        let horario_res = fechaIterada(fec_aux, horario);
        respuesta.push(horario_res);
        fec_aux.setDate(fec_aux.getDate() + 1);
    }
    return respuesta;
}
function fechaIterada(fechaIterada, horario) {
    let est;
    if (fechaIterada.getDay() === 0) {
        est = horario.domingo;
    }
    else if (fechaIterada.getDay() === 1) {
        est = horario.lunes;
    }
    else if (fechaIterada.getDay() === 2) {
        est = horario.martes;
    }
    else if (fechaIterada.getDay() === 3) {
        est = horario.miercoles;
    }
    else if (fechaIterada.getDay() === 4) {
        est = horario.jueves;
    }
    else if (fechaIterada.getDay() === 5) {
        est = horario.viernes;
    }
    else if (fechaIterada.getDay() === 6) {
        est = horario.sabado;
    }
    return {
        fecha: fechaIterada.toJSON().split('T')[0],
        estado: est
    };
}
