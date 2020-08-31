"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catNotificacionesControlador_1 = __importDefault(require("../../controlador/catalogos/catNotificacionesControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class NotificacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catNotificacionesControlador_1.default.ListarNotificaciones);
        this.router.get('/depa/:id_depa', VerificarToken_1.TokenValidation, catNotificacionesControlador_1.default.ListarNotiByDepartamento);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catNotificacionesControlador_1.default.ObtenerUnaNotificacion);
        this.router.get('/listar/final', VerificarToken_1.TokenValidation, catNotificacionesControlador_1.default.NotificacionLista);
        this.router.post('/', VerificarToken_1.TokenValidation, catNotificacionesControlador_1.default.CrearNotificacion);
        this.router.get('/notificacionPermiso/:id_tipo_permiso', VerificarToken_1.TokenValidation, catNotificacionesControlador_1.default.ObtenerNotificacionPermiso);
    }
}
const NOTIFICACIONES_RUTAS = new NotificacionesRutas();
exports.default = NOTIFICACIONES_RUTAS.router;
