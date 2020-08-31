"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catNotiAutorizacionesControlador_1 = __importDefault(require("../../controlador/catalogos/catNotiAutorizacionesControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class NotificacionesAutorizacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catNotiAutorizacionesControlador_1.default.ListarNotiAutorizaciones);
        this.router.get('/lista/:id_notificacion', VerificarToken_1.TokenValidation, catNotiAutorizacionesControlador_1.default.ListarPorNotificacion);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catNotiAutorizacionesControlador_1.default.ObtenerUnaNotiAutorizacion);
        this.router.post('/', VerificarToken_1.TokenValidation, catNotiAutorizacionesControlador_1.default.CrearNotiAutorizacion);
    }
}
const NOTIFICACIONES_AUTORIZACIONES_RUTA = new NotificacionesAutorizacionesRutas();
exports.default = NOTIFICACIONES_AUTORIZACIONES_RUTA.router;
