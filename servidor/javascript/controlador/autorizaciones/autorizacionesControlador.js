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
class AutorizacionesControlador {
    ListarAutorizaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const AUTORIZACIONES = yield database_1.default.query('SELECT * FROM autorizaciones ORDER BY id');
            if (AUTORIZACIONES.rowCount > 0) {
                return res.json(AUTORIZACIONES.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnaAutorizacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const AUTORIZACIONES = yield database_1.default.query('SELECT * FROM autorizaciones');
            if (AUTORIZACIONES.rowCount > 0) {
                return res.json(AUTORIZACIONES.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearAutorizacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento } = req.body;
            yield database_1.default.query('INSERT INTO autorizaciones ( id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento]);
            res.json({ message: 'Autorizacion guardado' });
        });
    }
}
exports.AUTORIZACION_CONTROLADOR = new AutorizacionesControlador();
exports.default = exports.AUTORIZACION_CONTROLADOR;