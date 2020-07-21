"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catNotificacionesControlador_1 = __importDefault(require("../../controlador/catalogos/catNotificacionesControlador"));
class NotificacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catNotificacionesControlador_1.default.ListarNotificaciones);
        this.router.get('/depa/:id_depa', catNotificacionesControlador_1.default.ListarNotiByDepartamento);
        this.router.get('/:id', catNotificacionesControlador_1.default.ObtenerUnaNotificacion);
        this.router.get('/listar/final', catNotificacionesControlador_1.default.NotificacionLista);
        this.router.post('/', catNotificacionesControlador_1.default.CrearNotificacion);
        this.router.get('/notificacionPermiso/:id_tipo_permiso', catNotificacionesControlador_1.default.ObtenerNotificacionPermiso);
    }
}
const NOTIFICACIONES_RUTAS = new NotificacionesRutas();
exports.default = NOTIFICACIONES_RUTAS.router;
