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
}
exports.timbresControlador = new TimbresControlador;
exports.default = exports.timbresControlador;
