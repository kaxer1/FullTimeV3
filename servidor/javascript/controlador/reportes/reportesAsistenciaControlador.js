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
    /**
     * Realiza un array de sucursales con departamentos y empleados dependiendo del estado del empleado si busca empleados activos o inactivos.
     * @returns Retorna Array de [Sucursales[Departamentos[empleados[]]]]
     */
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
                    if (estado === '1') {
                        ele.empleado = yield database_1.default.query('SELECT DISTINCT e.id, CONCAT(nombre, \' \', apellido) name_empleado, e.codigo, e.cedula, e.genero FROM empl_cargos AS ca, empl_contratos AS co, cg_regimenes AS r, empleados AS e ' +
                            'WHERE ca.id_departamento = $1 AND ca.id_empl_contrato = co.id AND co.id_regimen = r.id AND co.id_empleado = e.id AND e.estado = $2', [ele.id_depa, estado])
                            .then(result => { return result.rows; });
                    }
                    else {
                        ele.empleado = yield database_1.default.query('SELECT DISTINCT e.id, CONCAT(nombre, \' \', apellido) name_empleado, e.codigo, e.cedula, e.genero, ca.fec_final FROM empl_cargos AS ca, empl_contratos AS co, cg_regimenes AS r, empleados AS e ' +
                            'WHERE ca.id_departamento = $1 AND ca.id_empl_contrato = co.id AND co.id_regimen = r.id AND co.id_empleado = e.id AND e.estado = $2', [ele.id_depa, estado])
                            .then(result => { return result.rows; });
                    }
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
            return res.status(200).jsonp(respuesta);
        });
    }
    /**
     * Función que calcula el tiempo de atraso según el timbre realizado por el o los empleados.
     * @returns Retorna un JSON con la informacion de los empleados atrasados en dias laborables.
     */
    ReporteAtrasosMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            let n = [];
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            let timbres = yield BuscarTimbresEoSReporte(desde, hasta, o.codigo);
                            o.timbres = yield Promise.all(timbres.map((e) => __awaiter(this, void 0, void 0, function* () {
                                return yield ModelarAtrasosReporte(e);
                            })));
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
            else {
                // Resultados de timbres sin acciones
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.timbres = yield AtrasosTimbresSinAccion(desde, hasta, o.codigo);
                            // console.log('Timbres sin acciones: ',o);
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.map((t) => {
                        t.timbres = t.timbres.filter((a) => { return a != 0; });
                        return t;
                    }).filter((t) => { return t.timbres.length > 0; });
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
    /**
     * Función que devuelve los dias que el empleado falto a laborar según su horario.
     * @returns Retorna un JSON con la informacion de los empleados que an faltado a laborar.
     */
    ReporteFaltasMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            let n = [];
            //El reporte funciona para relojs de 6, 3 y sin acciones.        
            n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
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
            //El reporte funciona para relojs de 6, 3 y sin acciones.
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                        o.cargo = yield database_1.default.query('SELECT tc.cargo FROM empl_contratos AS co, empl_cargos AS ca, tipo_cargo AS tc WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato AND tc.id = ca.cargo ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
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
    /**
     * Función que compara el horario del empleado con los timbres que realiza en un dia laborar para poder calcular sus horas trabajadas.
     * @returns Retorna empleados con calculos de las horas trabajadas si todos los timbres estan registrados. Aqui no van incluidas horas extras.
     */
    ReporteHorasTrabajaMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            // console.log(desde, hasta);
            let datos = req.body;
            // console.log(datos);
            let n = [];
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.timbres = yield ModelarHorasTrabajaReporte(o.codigo, desde, hasta);
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
            else {
                // Resultados de timbres sin acciones
                // console.log('LLEGO A TIMBRES SIN ACCIONES');
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.timbres = yield ModelarHorasTrabajaTimbresSinAcciones(o.codigo, desde, hasta);
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((t) => { return t.timbres.length > 0; });
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No hay timbres de empleados en ese periodo' });
            return res.status(200).jsonp(datos);
        });
    }
    /**
     * Función que realiza una semaforizacion segun los dias puntuales de cada uno de los empleados.
     * @returns Retorna los empleados y total de dias puntuales que a llegado segun un rango de fechas.
     */
    ReportePuntualidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            let datos = req.body;
            let params_query = req.query;
            // console.log(params_query);  
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                            o.cargo = yield database_1.default.query('SELECT tc.cargo FROM empl_contratos AS co, empl_cargos AS ca, tipo_cargo AS tc WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato AND tc.id = ca.cargo ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
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
            }
            else {
                // Resultados de timbres sin acciones
                let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                            o.cargo = yield database_1.default.query('SELECT tc.cargo FROM empl_contratos AS co, empl_cargos AS ca, tipo_cargo AS tc WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato AND tc.id = ca.cargo ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                            let timbres = yield BuscarTimbresSinAccionesDeEntrada(desde, hasta, o.codigo);
                            o.puntualidad = (timbres.length === 0) ? 0 : parseInt(SubMetodosGraficas_1.SumarValoresArray(timbres));
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
            }
        });
    }
    ReporteTimbresIncompletos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { desde, hasta } = req.params;
            let datos = req.body;
            let n = [];
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                            o.cargo = yield database_1.default.query('SELECT tc.cargo FROM empl_contratos AS co, empl_cargos AS ca, tipo_cargo AS tc WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato AND tc.id = ca.cargo ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                            o.timbres = yield TimbresIncompletos(new Date(desde), new Date(hasta), o.codigo);
                            // console.log(o);
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
            else {
                // Resultados de timbres sin acciones
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                            o.cargo = yield database_1.default.query('SELECT tc.cargo FROM empl_contratos AS co, empl_cargos AS ca, tipo_cargo AS tc WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato AND tc.id = ca.cargo ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                            o.timbres = yield TimbresSinAccionesIncompletos(new Date(desde), new Date(hasta), o.codigo);
                            // console.log(o);
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
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
            let datos = req.body;
            let n = [];
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                            o.cargo = yield database_1.default.query('SELECT tc.cargo FROM empl_contratos AS co, empl_cargos AS ca, tipo_cargo AS tc WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato AND tc.id = ca.cargo ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                            o.timbres = yield TimbresTabulados(desde, hasta, o.codigo);
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
            else {
                // Resultados de timbres sin acciones
                n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                            o.contrato = yield database_1.default.query('SELECT r.descripcion AS contrato FROM cg_regimenes AS r, empl_contratos AS c WHERE c.id_regimen = r.id AND c.id_empleado = $1 ORDER BY c.fec_ingreso DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].contrato; });
                            o.cargo = yield database_1.default.query('SELECT tc.cargo FROM empl_contratos AS co, empl_cargos AS ca, tipo_cargo AS tc WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato AND tc.id = ca.cargo ORDER BY ca.fec_inicio DESC LIMIT 1 ', [o.id]).then(result => { return result.rows[0].cargo; });
                            o.timbres = yield TimbresSinAccionesTabulados(desde, hasta, o.codigo);
                            return o;
                        })));
                        return ele;
                    })));
                    return obj;
                })));
            }
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
            let datos = req.body;
            //El reporte funciona para relojs de 6, 3 y sin acciones.        
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.timbres = yield BuscarTimbres(desde, hasta, o.codigo);
                        console.log('Timbres: ', o);
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
                return res.status(400).jsonp({ message: 'No hay timbres de empleados en ese periodo' });
            return res.status(200).jsonp(nuevo);
        });
    }
}
const REPORTE_A_CONTROLADOR = new ReportesAsistenciaControlador();
exports.default = REPORTE_A_CONTROLADOR;
const AtrasosTimbresSinAccion = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        const orden = 1;
        // console.log('ATRASOS - TIMBRES SIN ACCION: ', fec_inicio, fec_final, codigo );
        let horarioEntrada = yield database_1.default.query('SELECT dt.hora, dt.minu_espera, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR), ' +
            'eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo ' +
            'FROM empl_horarios AS eh, cg_horarios AS ch, deta_horarios AS dt ' +
            'WHERE dt.orden = $1 AND eh.fec_inicio BETWEEN $2 AND $3 AND eh.fec_final BETWEEN $2 AND $3 AND eh.codigo = $4 ' +
            'AND eh.id_horarios = ch.id AND ch.id = dt.id_horario', [orden, new Date(fec_inicio), new Date(fec_final), codigo])
            .then(result => { return result.rows; });
        if (horarioEntrada.length === 0)
            return [0];
        // console.log('HORARIOS: ',horarioEntrada);    
        let nuevo = [];
        let aux = yield Promise.all(horarioEntrada.map((obj) => __awaiter(this, void 0, void 0, function* () {
            let fechas = SubMetodosGraficas_1.ModelarFechas(obj.fec_inicio, obj.fec_final, obj);
            const hora_seg = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora) + (obj.minu_espera * 60);
            let timbres = yield Promise.all(fechas.map((o) => __awaiter(this, void 0, void 0, function* () {
                var f_inicio = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg);
                var f_final = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg + SubMetodosGraficas_1.HHMMtoSegundos('02:00:00'));
                // console.log( f_inicio, ' || ', f_final, ' || ', codigo);
                const query = 'SELECT CAST(fec_hora_timbre AS VARCHAR) from timbres where fec_hora_timbre >= TO_TIMESTAMP(\'' + f_inicio + '\'' + ', \'YYYY-MM-DD HH:MI:SS\') ' +
                    'and fec_hora_timbre <= TO_TIMESTAMP(\'' + f_final + '\'' + ', \'YYYY-MM-DD HH:MI:SS\') and id_empleado = ' + codigo + ' order by fec_hora_timbre';
                // console.log(query);
                return yield database_1.default.query(query)
                    .then(res => {
                    if (res.rowCount === 0) {
                        return 0;
                    }
                    else {
                        const f_timbre = res.rows[0].fec_hora_timbre.split(' ')[0];
                        const h_timbre = res.rows[0].fec_hora_timbre.split(' ')[1];
                        const t_tim = SubMetodosGraficas_1.HHMMtoSegundos(h_timbre);
                        // console.log(f_timbre);
                        let diferencia = (t_tim - hora_seg) / 3600;
                        return {
                            fecha: DiaSemana(new Date(f_timbre)) + ' ' + f_timbre,
                            horario: obj.hora,
                            timbre: h_timbre,
                            atraso_dec: diferencia.toFixed(2),
                            atraso_HHMM: SubMetodosGraficas_1.SegundosToHHMM(t_tim - hora_seg),
                        };
                    }
                });
            })));
            return timbres;
        })));
        aux.forEach(obj => {
            if (obj.length > 0) {
                obj.forEach(o => {
                    if (o !== 0) {
                        nuevo.push(o);
                    }
                });
            }
        });
        // console.log('Este es el resul: ',nuevo);
        return nuevo;
    });
};
const BuscarTimbresEoSReporte = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_empleado FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND accion in (\'EoS\', \'E\') AND id_empleado = $3 ORDER BY fec_hora_timbre ASC ', [fec_inicio, fec_final, codigo])
            .then(res => {
            return res.rows;
        });
    });
};
const BuscarTimbresSinAccionesDeEntrada = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        const orden = 1;
        let horarioEntrada = yield database_1.default.query('SELECT dt.hora, dt.minu_espera, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR), ' +
            'eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo ' +
            'FROM empl_horarios AS eh, cg_horarios AS ch, deta_horarios AS dt ' +
            'WHERE dt.orden = $1 AND eh.fec_inicio BETWEEN $2 AND $3 AND eh.fec_final BETWEEN $2 AND $3 AND eh.codigo = $4 ' +
            'AND eh.id_horarios = ch.id AND ch.id = dt.id_horario', [orden, new Date(fec_inicio), new Date(fec_final), codigo])
            .then(result => { return result.rows; });
        if (horarioEntrada.length === 0)
            return [];
        let aux = yield Promise.all(horarioEntrada.map((obj) => __awaiter(this, void 0, void 0, function* () {
            let fechas = SubMetodosGraficas_1.ModelarFechas(obj.fec_inicio, obj.fec_final, obj);
            const hora_seg = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora) + (obj.minu_espera * 60);
            let timbres = yield Promise.all(fechas.map((o) => __awaiter(this, void 0, void 0, function* () {
                var f_inicio = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg - SubMetodosGraficas_1.HHMMtoSegundos('02:00:00'));
                var f_final = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg);
                // console.log( f_inicio, ' || ', f_final, ' || ', codigo);
                const query = 'SELECT CAST(fec_hora_timbre AS VARCHAR) from timbres where fec_hora_timbre >= TO_TIMESTAMP(\'' + f_inicio + '\'' + ', \'YYYY-MM-DD HH:MI:SS\') ' +
                    'and fec_hora_timbre <= TO_TIMESTAMP(\'' + f_final + '\'' + ', \'YYYY-MM-DD HH:MI:SS\') and id_empleado = ' + codigo + ' order by fec_hora_timbre';
                return yield database_1.default.query(query).then(res => { return res.rows; });
            })));
            return timbres.filter(o => {
                return o.length >= 1;
            }).map((e) => {
                // console.warn('Filtrado:',e);
                return 1;
            });
        })));
        let nuevo = [];
        aux.filter(o => {
            return o.length >= 1;
        }).forEach((o) => {
            o.forEach(e => {
                nuevo.push(e);
            });
        });
        return nuevo;
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
        if (array.length === 0)
            return 0;
        console.log('Hora entrada y minuto Atrasos', array);
        return array.map(ele => {
            let retraso = false;
            var timbre = SubMetodosGraficas_1.HHMMtoSegundos(obj.fec_hora_timbre.split(' ')[1]);
            var hora_seg = SubMetodosGraficas_1.HHMMtoSegundos(ele.hora) + ele.minu_espera * 60;
            console.log('Timbre: ', timbre, hora_seg);
            retraso = (timbre > hora_seg) ? true : false;
            if (retraso === false)
                return 0;
            let diferencia = (timbre - hora_seg) / 3600;
            if (diferencia > 4)
                return 0;
            return {
                fecha: DiaSemana(new Date(obj.fec_hora_timbre.split(' ')[0])) + ' ' + obj.fec_hora_timbre.split(' ')[0],
                horario: ele.hora,
                timbre: obj.fec_hora_timbre.split(' ')[1],
                atraso_dec: diferencia.toFixed(2),
                atraso_HHMM: SubMetodosGraficas_1.SegundosToHHMM(timbre - hora_seg),
            };
        })[0];
    });
};
function DiaSemana(dia) {
    let dias = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    return dias[dia.getUTCDay()];
}
const BuscarTimbresReporte = function (fecha, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), accion, observacion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 AND accion in (\'EoS\',\'AES\',\'S\',\'E\',\'E/A\',\'S/A\') ORDER BY fec_hora_timbre ASC ', [fecha, codigo])
            .then(res => {
            return res.rows;
        });
    });
};
const BuscarTimbresSinAccionesReporte = function (fecha, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR), observacion FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) like $1 || \'%\' AND id_empleado = $2 ORDER BY fec_hora_timbre ASC ', [fecha, codigo])
            .then(res => {
            return res.rows;
        });
    });
};
const ModelarHorasTrabajaReporte = function (codigo, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(codigo, fec_inicio, fec_final);
        let array = yield database_1.default.query('SELECT dh.hora, dh.orden, dh.id_horario, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR) FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
            'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' +
            'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ORDER BY eh.fec_inicio', [codigo, fec_inicio, fec_final])
            .then(res => { return res.rows; });
        if (array.length === 0)
            return [];
        console.log('ARRAY MODELAR HORAS TRABAJADAS: ', array);
        var nuevoArray = [];
        var arrayTemporal = [];
        for (var i = 0; i < array.length; i++) {
            arrayTemporal = nuevoArray.filter((res) => {
                return res["Fecha"] == array[i]["fec_inicio"] + ' ' + array[i]["fec_final"];
            });
            if (arrayTemporal.length > 0) {
                nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["Horario"].push(array[i]);
            }
            else {
                nuevoArray.push({ "Fecha": array[i]["fec_inicio"] + ' ' + array[i]["fec_final"], "Horario": [array[i]] });
            }
        }
        nuevoArray.sort(compareFechas);
        let res_timbre = yield Promise.all(nuevoArray.map((obj) => __awaiter(this, void 0, void 0, function* () {
            var fec_aux = new Date(obj.Fecha.split(' ')[0]);
            var fecha1 = moment_1.default(obj.Fecha.split(' ')[0]);
            var fecha2 = moment_1.default(obj.Fecha.split(' ')[1]);
            var diasDiferencia = fecha2.diff(fecha1, 'days');
            let res = [];
            for (let i = 0; i <= diasDiferencia; i++) {
                let horario_res = {
                    fecha: fec_aux.toJSON().split('T')[0],
                    timbres: yield BuscarTimbresReporte(fec_aux.toJSON().split('T')[0], codigo),
                    horario: obj.Horario.sort(compareOrden)
                };
                if (horario_res.timbres.length > 0) {
                    res.push(horario_res);
                }
                fec_aux.setDate(fec_aux.getDate() + 1);
            }
            return res;
        })));
        let respuesta = res_timbre.filter((obj) => {
            return obj.length > 0;
        });
        let arr_respuesta = [];
        respuesta.forEach((arr) => {
            arr.forEach((o) => {
                let obj = {
                    fecha: o.fecha,
                    horarios: [],
                    total_timbres: '',
                    total_horario: '',
                    total_diferencia: '',
                };
                let arr_EoS = [];
                let arr_AES = [];
                let arr_horario_EoS = [];
                let arr_horario_AES = [];
                o.horario.forEach((h) => {
                    let obj2 = {
                        hora_horario: h.hora,
                        hora_diferencia: '',
                        hora_timbre: '',
                        accion: '',
                        observacion: ''
                    };
                    let diferencia = 0;
                    let dif = 0;
                    switch (h.orden) {
                        case 1:
                            var arr3 = o.timbres.filter((t) => { return t.accion === 'EoS' || t.accion === 'E'; });
                            if (arr3.length === 0) {
                                obj2.accion = 'EoS';
                                obj2.hora_timbre = h.hora;
                                obj2.observacion = 'Entrada';
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre);
                            }
                            else {
                                obj2.accion = arr3[0].accion;
                                obj2.observacion = arr3[0].observacion;
                                obj2.hora_timbre = arr3[0].fec_hora_timbre.split(' ')[1];
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre);
                            }
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        case 2:
                            var arr4 = o.timbres.filter((t) => { return t.accion === 'AES' || t.accion === 'S/A'; });
                            if (arr4.length === 0) {
                                obj2.accion = 'AES';
                                obj2.hora_timbre = h.hora;
                                obj2.observacion = 'Salida Almuerzo';
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre) - SubMetodosGraficas_1.HHMMtoSegundos(h.hora);
                            }
                            else {
                                obj2.accion = arr4[0].accion;
                                obj2.observacion = arr4[0].observacion;
                                obj2.hora_timbre = arr4[0].fec_hora_timbre.split(' ')[1];
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre) - SubMetodosGraficas_1.HHMMtoSegundos(h.hora);
                            }
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        case 3:
                            var arr1 = o.timbres.filter((t) => { return t.accion === 'AES' || t.accion === 'E/A'; });
                            if (arr1.length === 0) {
                                obj2.accion = 'AES';
                                obj2.hora_timbre = h.hora;
                                obj2.observacion = 'Entrada Almuerzo';
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre);
                            }
                            else {
                                obj2.accion = arr1[arr1.length - 1].accion;
                                obj2.observacion = arr1[arr1.length - 1].observacion;
                                obj2.hora_timbre = arr1[arr1.length - 1].fec_hora_timbre.split(' ')[1];
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre);
                            }
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        case 4:
                            var arr2 = o.timbres.filter((t) => { return t.accion === 'EoS' || t.accion === 'S'; });
                            if (arr2.length === 0) {
                                obj2.accion = 'EoS';
                                obj2.hora_timbre = h.hora;
                                obj2.observacion = 'Salida';
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre) - SubMetodosGraficas_1.HHMMtoSegundos(h.hora);
                            }
                            else {
                                obj2.accion = arr2[arr2.length - 1].accion;
                                obj2.observacion = arr2[arr2.length - 1].observacion;
                                obj2.hora_timbre = arr2[arr2.length - 1].fec_hora_timbre.split(' ')[1];
                                dif = SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre) - SubMetodosGraficas_1.HHMMtoSegundos(h.hora);
                            }
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        default:
                            break;
                    }
                    obj.horarios.push(obj2);
                });
                var resta_hor_EoS = parseFloat(arr_horario_EoS[1]) - parseFloat(arr_horario_EoS[0]);
                var resta_hor_AES = parseFloat(arr_horario_AES[1]) - parseFloat(arr_horario_AES[0]);
                let resta_hor = resta_hor_EoS - resta_hor_AES;
                obj.total_horario = SubMetodosGraficas_1.SegundosToHHMM(resta_hor);
                let resta_tim_EoS = parseFloat(arr_EoS[1]) - parseFloat(arr_EoS[0]);
                let resta_tim_AES = parseFloat(arr_AES[1]) - parseFloat(arr_AES[0]);
                let resta_tim = resta_tim_EoS - resta_tim_AES;
                obj.total_timbres = SubMetodosGraficas_1.SegundosToHHMM(resta_tim);
                let dif_total = resta_tim - resta_hor;
                let diferencia_Total = 0;
                diferencia_Total = (dif_total < 0) ? dif_total * (-1) : dif_total;
                obj.total_diferencia = (dif_total < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia_Total) : SubMetodosGraficas_1.SegundosToHHMM(diferencia_Total);
                arr_respuesta.push(obj);
            });
        });
        nuevoArray = [];
        res_timbre = [];
        respuesta = [];
        array = [];
        return arr_respuesta;
    });
};
const ModelarHorasTrabajaTimbresSinAcciones = function (codigo, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        let array = yield database_1.default.query('SELECT dh.hora, dh.orden, dh.id_horario, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR) FROM empl_horarios AS eh, cg_horarios AS h, deta_horarios AS dh ' +
            'WHERE eh.codigo = $1 AND h.id = eh.id_horarios AND dh.id_horario = h.id AND CAST(eh.fec_inicio AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ' +
            'AND CAST(eh.fec_final AS VARCHAR) between $2 || \'%\' AND $3 || \'%\' ORDER BY eh.fec_inicio', [codigo, fec_inicio, fec_final])
            .then(res => { return res.rows; });
        if (array.length === 0)
            return [];
        // console.log('ARRAY MODELAR HORAS TRABAJADAS: ',array);
        var nuevoArray = [];
        var arrayTemporal = [];
        for (var i = 0; i < array.length; i++) {
            arrayTemporal = nuevoArray.filter((res) => {
                return res["Fecha"] == array[i]["fec_inicio"] + ' ' + array[i]["fec_final"];
            });
            if (arrayTemporal.length > 0) {
                nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["Horario"].push(array[i]);
            }
            else {
                nuevoArray.push({ "Fecha": array[i]["fec_inicio"] + ' ' + array[i]["fec_final"], "Horario": [array[i]] });
            }
        }
        nuevoArray.sort(compareFechas);
        let res_timbre = yield Promise.all(nuevoArray.map((obj) => __awaiter(this, void 0, void 0, function* () {
            var fec_aux = new Date(obj.Fecha.split(' ')[0]);
            var fecha1 = moment_1.default(obj.Fecha.split(' ')[0]);
            var fecha2 = moment_1.default(obj.Fecha.split(' ')[1]);
            var diasDiferencia = fecha2.diff(fecha1, 'days');
            let res = [];
            for (let i = 0; i <= diasDiferencia; i++) {
                let horario_res = {
                    fecha: fec_aux.toJSON().split('T')[0],
                    timbres: yield BuscarTimbresSinAccionesReporte(fec_aux.toJSON().split('T')[0], codigo),
                    horario: obj.Horario.sort(compareOrden)
                };
                if (horario_res.timbres.length > 0) {
                    res.push(horario_res);
                }
                fec_aux.setDate(fec_aux.getDate() + 1);
            }
            return res;
        })));
        let respuesta = res_timbre.filter((obj) => {
            return obj.length > 0;
        });
        // console.log('Respuesta timbres sin acciones:',respuesta);
        let arr_respuesta = [];
        respuesta.forEach((arr) => {
            arr.forEach((o) => {
                let obj = {
                    fecha: o.fecha,
                    horarios: [],
                    total_timbres: '',
                    total_horario: '',
                    total_diferencia: '',
                };
                let arr_EoS = [];
                let arr_AES = [];
                let arr_horario_EoS = [];
                let arr_horario_AES = [];
                o.horario.forEach((h) => {
                    let obj2 = {
                        hora_horario: h.hora,
                        hora_diferencia: '',
                        hora_timbre: '',
                        accion: '',
                        observacion: ''
                    };
                    let diferencia = 0;
                    let dif = 0;
                    switch (h.orden) {
                        case 1:
                            var arr3 = o.timbres.filter((t) => {
                                const hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                                const h_inicio = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos('01:30:00');
                                const h_final = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) + SubMetodosGraficas_1.HHMMtoSegundos('01:59:00');
                                return (h_inicio <= hora_timbre && h_final >= hora_timbre);
                            });
                            obj2.hora_timbre = (arr3.length === 0) ? '' : arr3[0].fec_hora_timbre.split(' ')[1];
                            obj2.observacion = (arr3.length === 0) ? 'Entrada' : arr3[0].observacion;
                            obj2.accion = 'EoS';
                            dif = (obj2.hora_timbre === '') ? 0 : SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre);
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        case 2:
                            var arr4 = o.timbres.filter((t) => {
                                const hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                                const h_inicio = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos('00:59:00');
                                const h_final = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) + SubMetodosGraficas_1.HHMMtoSegundos('00:59:00');
                                return (h_inicio <= hora_timbre && h_final >= hora_timbre);
                            });
                            obj2.hora_timbre = (arr4.length === 0) ? '' : arr4[0].fec_hora_timbre.split(' ')[1];
                            obj2.observacion = (arr4.length === 0) ? 'Salida Almuerzo' : arr4[0].observacion;
                            obj2.accion = 'AES';
                            dif = (obj2.hora_timbre === '') ? 0 : SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre) - SubMetodosGraficas_1.HHMMtoSegundos(h.hora);
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        case 3:
                            var arr1 = o.timbres.filter((t) => {
                                const hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                                const h_inicio = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos('00:59:00');
                                const h_final = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) + SubMetodosGraficas_1.HHMMtoSegundos('00:59:00');
                                return (h_inicio <= hora_timbre && h_final >= hora_timbre);
                            });
                            obj2.hora_timbre = (arr1.length === 0) ? '' : arr1[0].fec_hora_timbre.split(' ')[1];
                            obj2.observacion = (arr1.length === 0) ? 'Entrada Almuerzo' : arr1[0].observacion;
                            obj2.accion = 'AES';
                            dif = (obj2.hora_timbre === '') ? 0 : SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre);
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_AES.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        case 4:
                            var arr2 = o.timbres.filter((t) => {
                                const hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(t.fec_hora_timbre.split(' ')[1]);
                                const h_inicio = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos('01:59:00');
                                const h_final = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) + SubMetodosGraficas_1.HHMMtoSegundos('01:30:00');
                                return (h_inicio <= hora_timbre && h_final >= hora_timbre);
                            });
                            obj2.hora_timbre = (arr2.length === 0) ? '' : arr2[0].fec_hora_timbre.split(' ')[1];
                            obj2.observacion = (arr2.length === 0) ? 'Salida' : arr2[0].observacion;
                            obj2.accion = 'EoS';
                            dif = (obj2.hora_timbre === '') ? 0 : SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre) - SubMetodosGraficas_1.HHMMtoSegundos(h.hora);
                            diferencia = (dif < 0) ? dif * (-1) : dif;
                            obj2.hora_diferencia = (dif < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia) : SubMetodosGraficas_1.SegundosToHHMM(diferencia);
                            arr_horario_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_horario));
                            arr_EoS.push(SubMetodosGraficas_1.HHMMtoSegundos(obj2.hora_timbre));
                            break;
                        default:
                            break;
                    }
                    obj.horarios.push(obj2);
                });
                // RESTA DE TIEMPO DE LOS HORARIOS.
                var resta_hor_EoS = parseFloat(arr_horario_EoS[1]) - parseFloat(arr_horario_EoS[0]);
                var resta_hor_AES = parseFloat(arr_horario_AES[1]) - parseFloat(arr_horario_AES[0]);
                // console.log('RESTA HORARIOS: ',resta_hor_EoS, resta_hor_AES);
                let resta_hor = (resta_hor_EoS === 0 || resta_hor_AES === 0) ? 0 : resta_hor_EoS - resta_hor_AES;
                obj.total_horario = SubMetodosGraficas_1.SegundosToHHMM(resta_hor);
                // RESTA DE TIEMPO DE LOS TIMBRES
                let resta_tim_EoS = parseFloat(arr_EoS[1]) - parseFloat(arr_EoS[0]);
                let resta_tim_AES = parseFloat(arr_AES[1]) - parseFloat(arr_AES[0]);
                // console.log('RESTA TIMBRES: ',resta_tim_EoS, resta_tim_AES);
                let resta_tim = (resta_tim_EoS === 0 || resta_tim_AES === 0) ? 0 : resta_tim_EoS - resta_tim_AES;
                obj.total_timbres = SubMetodosGraficas_1.SegundosToHHMM(resta_tim);
                let dif_total = (resta_tim === 0 || resta_hor === 0) ? 0 : resta_tim - resta_hor;
                let diferencia_Total = (dif_total < 0) ? dif_total * (-1) : dif_total;
                obj.total_diferencia = (dif_total < 0) ? '-' + SubMetodosGraficas_1.SegundosToHHMM(diferencia_Total) : SubMetodosGraficas_1.SegundosToHHMM(diferencia_Total);
                arr_respuesta.push(obj);
            });
        });
        nuevoArray = [];
        res_timbre = [];
        respuesta = [];
        array = [];
        return arr_respuesta;
    });
};
function BuscarHorarioEmpleado(fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield database_1.default.query('SELECT * FROM empl_horarios WHERE fec_inicio between $1::timestamp and $2::timestamp AND fec_final between $1::timestamp and $2::timestamp ' +
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
                    return 0;
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
            var timbre = SubMetodosGraficas_1.HHMMtoSegundos(obj.fec_hora_timbre.split(' ')[1]) / 3600;
            var hora = SubMetodosGraficas_1.HHMMtoSegundos(ele.hora) / 3600;
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
            console.log('NUEVO ARRAY TABULADO: ', obj);
            if (obj.Timbres[0].accion === 'EoS' || obj.Timbres[0].accion === 'AES' || obj.Timbres[0].accion === 'PES') {
                let e = {
                    fecha: obj.Fecha,
                    entrada: obj.Timbres.filter((ele) => { return ele.accion === 'EoS'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                    salida: obj.Timbres.filter((ele) => { return ele.accion === 'EoS'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[1],
                    sal_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'AES'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                    ent_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'AES'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[1],
                    desconocido: obj.Timbres.filter((ele) => { return ele.accion != 'EoS' && ele.accion != 'AES'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0]
                };
                arrayModelado.push(e);
            }
            else {
                let e = {
                    fecha: obj.Fecha,
                    entrada: obj.Timbres.filter((ele) => { return ele.accion === 'E'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                    salida: obj.Timbres.filter((ele) => { return ele.accion === 'S'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                    sal_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'S/A'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                    ent_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'E/A'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                    desconocido: obj.Timbres.filter((ele) => { return ele.accion != 'E' && ele.accion != 'S' && ele.accion != 'S/A' && ele.accion != 'E/A'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0]
                };
                arrayModelado.push(e);
            }
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
                    timbres_hora: yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR) AS timbre, accion FROM timbres WHERE id_empleado = $1 AND CAST(fec_hora_timbre AS VARCHAR) like $2 || \'%\' AND accion in (\'EoS\',\'AES\', \'S\',\'E\',\'E/A\',\'S/A\')', [obj.codigo, obj1.fecha]).then(result => { return result.rows; })
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
                        var h_inicio = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) - SubMetodosGraficas_1.HHMMtoSegundos('01:00:00');
                        var h_final = SubMetodosGraficas_1.HHMMtoSegundos(h.hora) + SubMetodosGraficas_1.HHMMtoSegundos('01:00:00');
                        let respuesta = o.timbres_hora.filter((t) => {
                            let hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(t.timbre.split(' ')[1]);
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
const TimbresSinAccionesTabulados = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        let horarioEntrada = yield database_1.default.query('SELECT dt.hora, tipo_accion, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR), ' +
            'eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo ' +
            'FROM empl_horarios AS eh, cg_horarios AS ch, deta_horarios AS dt ' +
            'WHERE eh.fec_inicio BETWEEN $1 AND $2 AND eh.fec_final BETWEEN $1 AND $2 AND eh.codigo = $3 AND eh.id_horarios = ch.id AND ch.id = dt.id_horario ' +
            'ORDER BY eh.fec_inicio ASC, dt.hora ASC', [new Date(fec_inicio), new Date(fec_final), codigo])
            .then(result => { return result.rows; });
        // console.log('HORARIO: ',horarioEntrada);    
        if (horarioEntrada.length === 0)
            return [];
        let aux = yield Promise.all(horarioEntrada.map((obj) => __awaiter(this, void 0, void 0, function* () {
            let fechas = SubMetodosGraficas_1.ModelarFechas(obj.fec_inicio, obj.fec_final, obj);
            const hora_seg = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora);
            let timbres = yield Promise.all(fechas.map((o) => __awaiter(this, void 0, void 0, function* () {
                var f_inicio = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg - SubMetodosGraficas_1.HHMMtoSegundos('00:59:00'));
                var f_final = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg + SubMetodosGraficas_1.HHMMtoSegundos('00:59:00'));
                // console.log( f_inicio, ' || ', f_final, ' || ', codigo);
                const query = 'SELECT CAST(fec_hora_timbre AS VARCHAR) from timbres where fec_hora_timbre >= TO_TIMESTAMP(\'' + f_inicio + '\'' + ', \'YYYY-MM-DD HH24:MI:SS\') ' +
                    'and fec_hora_timbre <= TO_TIMESTAMP(\'' + f_final + '\'' + ', \'YYYY-MM-DD HH24:MI:SS\') and id_empleado = ' + codigo + ' order by fec_hora_timbre';
                return yield database_1.default.query(query).then(res => {
                    let x = res.rows.map((elemento) => {
                        elemento.accion = obj.tipo_accion;
                        return elemento;
                    });
                    if (x.length === 0)
                        return res.rows;
                    return [x[x.length - 1]];
                });
            })));
            return timbres.filter(o => {
                return o.length >= 1;
            }).map((e) => {
                return e;
            });
        })));
        let timbres = [];
        aux.filter(o => {
            return o.length >= 1;
        }).forEach((o) => {
            o.forEach((e) => {
                e.forEach(t => {
                    timbres.push(t);
                });
            });
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
            console.log('NUEVO ARRAY TABULADO: ', obj);
            let e = {
                fecha: obj.Fecha,
                entrada: obj.Timbres.filter((ele) => { return ele.accion === 'E'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                sal_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'S/A'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                ent_Alm: obj.Timbres.filter((ele) => { return ele.accion === 'E/A'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                salida: obj.Timbres.filter((ele) => { return ele.accion === 'S'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0],
                desconocido: obj.Timbres.filter((ele) => { return ele.accion != 'E' && ele.accion != 'S' && ele.accion != 'S/A' && ele.accion != 'E/A'; }).map((ele) => { return ele.fec_hora_timbre.split(' ')[1]; })[0]
            };
            console.log(e);
            arrayModelado.push(e);
        });
        return arrayModelado;
    });
};
const TimbresSinAccionesIncompletos = function (fec_inicio, fec_final, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        let horarioEntrada = yield database_1.default.query('SELECT dt.hora, tipo_accion, CAST(eh.fec_inicio AS VARCHAR), CAST(eh.fec_final AS VARCHAR), ' +
            'eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo ' +
            'FROM empl_horarios AS eh, cg_horarios AS ch, deta_horarios AS dt ' +
            'WHERE eh.fec_inicio BETWEEN $1 AND $2 AND eh.fec_final BETWEEN $1 AND $2 AND eh.codigo = $3 AND eh.id_horarios = ch.id AND ch.id = dt.id_horario ' +
            'ORDER BY eh.fec_inicio ASC, dt.hora ASC', [fec_inicio, fec_final, codigo])
            .then(result => { return result.rows; });
        // console.log('HORARIO: ',horarioEntrada);    
        if (horarioEntrada.length === 0)
            return [];
        let aux = yield Promise.all(horarioEntrada.map((obj) => __awaiter(this, void 0, void 0, function* () {
            let fechas = SubMetodosGraficas_1.ModelarFechas(obj.fec_inicio, obj.fec_final, obj);
            const hora_seg = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora);
            const timbres = yield Promise.all(fechas.map((o) => __awaiter(this, void 0, void 0, function* () {
                var f_inicio = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg - SubMetodosGraficas_1.HHMMtoSegundos('00:59:00'));
                var f_final = o.fecha + ' ' + SubMetodosGraficas_1.SegundosToHHMM(hora_seg + SubMetodosGraficas_1.HHMMtoSegundos('00:59:00'));
                // console.log( f_inicio, ' || ', f_final, ' || ', codigo);
                const query = 'SELECT CAST(fec_hora_timbre AS VARCHAR) from timbres where fec_hora_timbre >= TO_TIMESTAMP(\'' + f_inicio + '\'' + ', \'YYYY-MM-DD HH24:MI:SS\') ' +
                    'and fec_hora_timbre <= TO_TIMESTAMP(\'' + f_final + '\'' + ', \'YYYY-MM-DD HH24:MI:SS\') and id_empleado = ' + codigo + ' order by fec_hora_timbre';
                return yield database_1.default.query(query).then(res => {
                    if (res.rowCount === 0) {
                        return {
                            fecha_timbre: o.fecha,
                            tipo: obj.tipo_accion,
                            hora: obj.hora
                        };
                    }
                    return 0;
                });
            })));
            return timbres.filter(o => {
                return o !== 0;
            }).map((e) => {
                return e;
            });
        })));
        let tim = [];
        aux.forEach((o) => {
            o.forEach((e) => {
                tim.push(e);
            });
        });
        var nuevoArray = [];
        var arrayTemporal = [];
        for (var i = 0; i < tim.length; i++) {
            arrayTemporal = nuevoArray.filter((res) => {
                return res["fecha"] == tim[i]["fecha_timbre"];
            });
            if (arrayTemporal.length > 0) {
                nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["timbres_hora"].push(tim[i]);
            }
            else {
                nuevoArray.push({ "fecha": tim[i]["fecha_timbre"], "timbres_hora": [tim[i]] });
            }
        }
        nuevoArray.sort(compareFechas);
        return nuevoArray;
    });
};
function compareFechas(a, b) {
    var uno = new Date(a.fecha);
    var dos = new Date(b.fecha);
    if (uno < dos)
        return -1;
    if (uno > dos)
        return 1;
    return 0;
}
function compareOrden(a, b) {
    if (a.orden < b.orden)
        return -1;
    if (a.orden > b.orden)
        return 1;
    return 0;
}
