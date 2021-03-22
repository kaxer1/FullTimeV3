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
exports.timbresControlador = void 0;
const database_1 = __importDefault(require("../../database"));
// import { ContarHoras } from '../../libs/contarHoras'
class TimbresControlador {
    ObtenerRealTimeTimbresEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            console.log(id_empleado);
            const TIMBRES_NOTIFICACION = yield database_1.default.query('SELECT * FROM realtime_timbres WHERE id_receives_empl = $1 ORDER BY create_at DESC LIMIT 5', [id_empleado])
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                if (result.rowCount > 0) {
                    return yield Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                        let nombre = yield database_1.default.query('SELECT nombre, apellido FROM empleados WHERE id = $1', [obj.id_send_empl]).then(ele => {
                            console.log(ele.rows[0].nombre + ele.rows[0].apellido);
                            return ele.rows[0].nombre + ' ' + ele.rows[0].apellido;
                        });
                        return {
                            create_at: obj.create_at,
                            descripcion: obj.descripcion,
                            visto: obj.visto,
                            id_timbre: obj.id_timbre,
                            empleado: nombre,
                            id: obj.id,
                            tipo: obj.tipo
                        };
                    })));
                }
                return [];
            }));
            if (TIMBRES_NOTIFICACION.length > 0) {
                return res.jsonp(TIMBRES_NOTIFICACION);
            }
            return res.status(404).jsonp({ message: 'No se encuentran registros' });
        });
    }
    ObtenerAvisosTimbresEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            console.log(id_empleado);
            const TIMBRES_NOTIFICACION = yield database_1.default.query('SELECT * FROM realtime_timbres WHERE id_receives_empl = $1 ORDER BY create_at DESC', [id_empleado])
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                if (result.rowCount > 0) {
                    return yield Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                        let nombre = yield database_1.default.query('SELECT nombre, apellido FROM empleados WHERE id = $1', [obj.id_send_empl]).then(ele => {
                            return ele.rows[0].nombre + ' ' + ele.rows[0].apellido;
                        });
                        return {
                            create_at: obj.create_at,
                            descripcion: obj.descripcion,
                            visto: obj.visto,
                            id_timbre: obj.id_timbre,
                            empleado: nombre,
                            id: obj.id
                        };
                    })));
                }
                return [];
            }));
            if (TIMBRES_NOTIFICACION.length > 0) {
                return res.jsonp(TIMBRES_NOTIFICACION);
            }
            return res.status(404).jsonp({ message: 'No se encuentran registros' });
        });
    }
    ActualizarVista(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_noti_timbre;
            const { visto } = req.body;
            console.log(id, visto);
            yield database_1.default.query('UPDATE realtime_timbres SET visto = $1 WHERE id = $2', [visto, id])
                .then(result => {
                res.jsonp({ message: 'Vista Actualizada' });
            });
        });
    }
    EliminarMultiplesAvisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const arrayIdsRealtimeTimbres = req.body;
            console.log(arrayIdsRealtimeTimbres);
            if (arrayIdsRealtimeTimbres.length > 0) {
                arrayIdsRealtimeTimbres.forEach((obj) => __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query('DELETE FROM realtime_timbres WHERE id = $1', [obj])
                        .then(result => {
                        console.log(result.command, 'REALTIME ELIMINADO ====>', obj);
                    });
                }));
                return res.jsonp({ message: 'Todos las notificaciones han sido eliminadas' });
            }
            return res.jsonp({ message: 'No seleccionó ningún timbre' });
        });
    }
    CrearTimbreWeb(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_reloj } = req.body;
                const id_empleado = req.userIdEmpleado;
                let code = yield database_1.default.query('SELECT codigo FROM empleados WHERE id = $1', [id_empleado]).then(result => { return result.rows; });
                if (code.length === 0)
                    return { mensaje: 'El empleado no tiene un codigo asignado.' };
                var codigo = parseInt(code[0].codigo);
                yield database_1.default.query('INSERT INTO timbres (fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_empleado, id_reloj) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, codigo, id_reloj])
                    .then(result => {
                    res.status(200).jsonp({ message: 'Timbre enviado' });
                }).catch(err => {
                    res.status(400).jsonp({ message: err });
                });
            }
            catch (error) {
                res.status(400).jsonp({ message: error });
            }
        });
    }
    CrearTimbreWebAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_empleado, id_reloj } = req.body;
                console.log(req.body);
                let code = yield database_1.default.query('SELECT codigo FROM empleados WHERE id = $1', [id_empleado]).then(result => { return result.rows; });
                if (code.length === 0)
                    return { mensaje: 'El empleado no tiene un codigo asignado.' };
                var codigo = parseInt(code[0].codigo);
                yield database_1.default.query('INSERT INTO timbres (fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_empleado, id_reloj) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, codigo, id_reloj])
                    .then(result => {
                    res.status(200).jsonp({ message: 'Timbre guardado' });
                }).catch(err => {
                    res.status(400).jsonp({ message: err });
                });
            }
            catch (error) {
                res.status(400).jsonp({ message: error });
            }
        });
    }
    ObtenerUltimoTimbreEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const codigo = req.userCodigo;
                let timbre = yield database_1.default.query('SELECT CAST(fec_hora_timbre AS VARCHAR) as timbre, accion FROM timbres WHERE id_empleado = $1 ORDER BY fec_hora_timbre DESC LIMIT 1', [codigo])
                    .then(result => {
                    return result.rows.map(obj => {
                        switch (obj.accion) {
                            case 'EoS':
                                obj.accion = 'Entrada o Salida';
                                break;
                            case 'AES':
                                obj.accion = 'Entrada o Salida Almuerzo';
                                break;
                            case 'PES':
                                obj.accion = 'Entrada o Salida Permiso';
                                break;
                            case 'E':
                                obj.accion = 'Entrada o Salida';
                                break;
                            case 'S':
                                obj.accion = 'Entrada o Salida';
                                break;
                            case 'E/A':
                                obj.accion = 'Entrada o Salida Almuerzo';
                                break;
                            case 'S/A':
                                obj.accion = 'Entrada o Salida Almuerzo';
                                break;
                            case 'E/P':
                                obj.accion = 'Entrada o Salida Permiso';
                                break;
                            case 'S/P':
                                obj.accion = 'Entrada o Salida Permiso';
                                break;
                            default:
                                obj.accion = 'codigo 99';
                                break;
                        }
                        return obj;
                    });
                });
                if (timbre.length === 0)
                    return res.status(400).jsonp({ mensaje: 'No ha timbrado.' });
                return res.status(200).jsonp(timbre[0]);
            }
            catch (error) {
                return res.status(400).jsonp({ message: error });
            }
        });
    }
    ObtenerTimbres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.userIdEmpleado;
                let timbres = yield database_1.default.query('SELECT CAST(t.fec_hora_timbre AS VARCHAR), t.accion, t.tecl_funcion, t.observacion, t.latitud, t.longitud, t.id_empleado, t.id_reloj ' +
                    'FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado ORDER BY t.fec_hora_timbre DESC LIMIT 100', [id]).then(result => {
                    return result.rows.map(obj => {
                        switch (obj.accion) {
                            case 'EoS':
                                obj.accion = 'Entrada o Salida';
                                break;
                            case 'AES':
                                obj.accion = 'Entrada o Salida Almuerzo';
                                break;
                            case 'PES':
                                obj.accion = 'Entrada o Salida Permiso';
                                break;
                            case 'E':
                                obj.accion = 'Entrada o Salida';
                                break;
                            case 'S':
                                obj.accion = 'Entrada o Salida';
                                break;
                            case 'E/A':
                                obj.accion = 'Entrada o Salida Almuerzo';
                                break;
                            case 'S/A':
                                obj.accion = 'Entrada o Salida Almuerzo';
                                break;
                            case 'E/P':
                                obj.accion = 'Entrada o Salida Permiso';
                                break;
                            case 'S/P':
                                obj.accion = 'Entrada o Salida Permiso';
                                break;
                            default:
                                obj.accion = 'codigo 99';
                                break;
                        }
                        return obj;
                    });
                });
                if (timbres.length === 0)
                    return res.status(400).jsonp({ message: 'No hay timbres' });
                let estado_cuenta = [{
                        timbres_PES: yield database_1.default.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado AND t.accion in (\'PES\', \'E/P\', \'S/P\')  ', [id]).then(result => { return result.rows[0].count; }),
                        timbres_AES: yield database_1.default.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado AND t.accion in (\'AES\', \'E/A\', \'S/A\') ', [id]).then(result => { return result.rows[0].count; }),
                        timbres_EoS: yield database_1.default.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado AND t.accion in (\'EoS\', \'E\', \'S\') ', [id]).then(result => { return result.rows[0].count; }),
                        total_timbres: yield database_1.default.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado', [id]).then(result => { return result.rows[0].count; })
                    }];
                return res.status(200).jsonp({
                    timbres: timbres,
                    cuenta: estado_cuenta,
                    info: yield database_1.default.query('SELECT tc.cargo, ca.sueldo, ca.hora_trabaja, eh.fec_inicio, eh.fec_final FROM empl_contratos AS co, empl_cargos AS ca, empl_horarios AS eh, tipo_cargo AS tc' +
                        'WHERE co.id_empleado = $1 AND ca.id_empl_contrato = co.id AND eh.id_empl_cargo = ca.id AND tc.id = ca.cargo ORDER BY eh.fec_inicio DESC LIMIT 1', [id]).then(result => {
                        console.log(result.rows);
                        return result.rows;
                    }),
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).jsonp({ message: error });
            }
        });
    }
}
exports.timbresControlador = new TimbresControlador;
exports.default = exports.timbresControlador;
