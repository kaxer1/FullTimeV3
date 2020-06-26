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
class NotificacionTiempoRealControlador {
    ListarNotificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const REAL_TIME_NOTIFICACION = yield database_1.default.query('SELECT * FROM realtime_noti ORDER BY id DESC');
            res.jsonp(REAL_TIME_NOTIFICACION.rows);
        });
    }
    ListaPorEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_send;
            const REAL_TIME_NOTIFICACION = yield database_1.default.query('SELECT * FROM realtime_noti WHERE id_send_empl = $1 ORDER BY id DESC', [id]);
            if (REAL_TIME_NOTIFICACION.rowCount > 0) {
                return res.jsonp(REAL_TIME_NOTIFICACION.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    ListaPorJefe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_receive;
            const REAL_TIME_NOTIFICACION = yield database_1.default.query('SELECT r.id, r.id_send_empl, r.id_receives_empl, r.id_receives_depa, r.estado, r.create_at, r.id_permiso, r.visto, e.nombre, e.apellido, p.descripcion FROM realtime_noti AS r, empleados AS e, permisos AS p WHERE r.id_receives_empl = $1 AND e.id = r.id_send_empl AND p.id = r.id_permiso ORDER BY id DESC LIMIT 5', [id]);
            if (REAL_TIME_NOTIFICACION.rowCount > 0) {
                return res.jsonp(REAL_TIME_NOTIFICACION.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    ObtenerUnaNotificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const REAL_TIME_NOTIFICACION = yield database_1.default.query('SELECT r.id, r.id_send_empl, r.id_receives_empl, r.id_receives_depa, r.estado, r.create_at, r.id_permiso, r.visto, e.nombre, e.apellido, p.descripcion FROM realtime_noti AS r, empleados AS e, permisos AS p WHERE r.id = $1 AND e.id = r.id_send_empl AND p.id = r.id_permiso', [id]);
            if (REAL_TIME_NOTIFICACION.rowCount > 0) {
                return res.jsonp(REAL_TIME_NOTIFICACION.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_send_empl, id_receives_empl, id_receives_depa, estado, create_at, id_permiso } = req.body;
            yield database_1.default.query('INSERT INTO realtime_noti ( id_send_empl, id_receives_empl, id_receives_depa, estado, create_at, id_permiso ) VALUES ($1, $2, $3, $4, $5, $6)', [id_send_empl, id_receives_empl, id_receives_depa, estado, create_at, id_permiso]);
            const REAL_TIME_NOTIFICACION = yield database_1.default.query('SELECT id FROM realtime_noti WHERE create_at = $1 AND id_permiso = $2', [create_at, id_permiso]);
            res.jsonp({ message: 'Notificacion guardada', _id: REAL_TIME_NOTIFICACION.rows[0].id });
        });
    }
    ActualizarVista(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { visto } = req.body;
            yield database_1.default.query('UPDATE realtime_noti SET visto = $1 WHERE id = $2', [visto, id]);
            res.jsonp({ message: 'Vista modificado' });
        });
    }
}
exports.NOTIFICACION_TIEMPO_REAL_CONTROLADOR = new NotificacionTiempoRealControlador();
exports.default = exports.NOTIFICACION_TIEMPO_REAL_CONTROLADOR;
