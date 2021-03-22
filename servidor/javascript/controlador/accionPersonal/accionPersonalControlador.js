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
class AccionPersonalControlador {
    /** TABLA TIPO_ACCION_PERSONAL */
    ListarTipoAccionPersonal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ACCION = yield database_1.default.query('SELECT tap.id, tap.id_proceso, tap.descripcion, tap.base_legal, ' +
                'tap.tipo_permiso, tap.tipo_vacacion, tap.tipo_situacion_propuesta, cp.nombre ' +
                'FROM tipo_accion_personal AS tap, cg_procesos AS cp WHERE cp.id = tap.id_proceso');
            if (ACCION.rowCount > 0) {
                return res.jsonp(ACCION.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearTipoAccionPersonal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta } = req.body;
            yield database_1.default.query('INSERT INTO tipo_accion_personal (id_proceso, descripcion, base_legal, tipo_permiso, ' +
                'tipo_vacacion, tipo_situacion_propuesta) VALUES($1, $2, $3, $4, $5, $6)', [id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta]);
            res.jsonp({ message: 'Autorización se registró con éxito' });
        });
    }
    EncontrarTipoAccionPersonalId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const ACCION = yield database_1.default.query('SELECT tap.id_proceso, tap.descripcion, tap.base_legal, ' +
                'tap.tipo_permiso, tap.tipo_vacacion, tap.tipo_situacion_propuesta, cp.nombre AS proceso ' +
                'FROM tipo_accion_personal AS tap, cg_procesos AS cp WHERE tap.id = $1 AND cp.id = tap.id_proceso', [id]);
            if (ACCION.rowCount > 0) {
                return res.jsonp(ACCION.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ActualizarTipoAccionPersonal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta, id } = req.body;
            yield database_1.default.query('UPDATE tipo_accion_personal SET id_proceso = $1, descripcion = $2, base_legal = $3, ' +
                'tipo_permiso = $4, tipo_vacacion = $5, tipo_situacion_propuesta = $6 WHERE id = $7', [id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta, id]);
            res.jsonp({ message: 'Registro exitoso' });
        });
    }
    EliminarTipoAccionPersonal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM tipo_accion_personal WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
}
exports.ACCION_PERSONAL_CONTROLADOR = new AccionPersonalControlador();
exports.default = exports.ACCION_PERSONAL_CONTROLADOR;
