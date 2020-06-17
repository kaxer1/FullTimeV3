"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catNotiAutorizacionesControlador_1 = __importDefault(require("../../controlador/catalogos/catNotiAutorizacionesControlador"));
class NotificacionesAutorizacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catNotiAutorizacionesControlador_1.default.ListarNotiAutorizaciones);
        this.router.get('/lista/:id_notificacion', catNotiAutorizacionesControlador_1.default.ListarPorNotificacion);
        this.router.get('/:id', catNotiAutorizacionesControlador_1.default.ObtenerUnaNotiAutorizacion);
        this.router.post('/', catNotiAutorizacionesControlador_1.default.CrearNotiAutorizacion);
    }
}
const NOTIFICACIONES_AUTORIZACIONES_RUTA = new NotificacionesAutorizacionesRutas();
exports.default = NOTIFICACIONES_AUTORIZACIONES_RUTA.router;
