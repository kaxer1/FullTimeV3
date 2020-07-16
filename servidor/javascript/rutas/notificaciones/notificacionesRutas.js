"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificacionesControlador_1 = __importDefault(require("../../controlador/notificaciones/notificacionesControlador"));
class NotificacionTiempoRealRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', notificacionesControlador_1.default.ListarNotificacion);
        this.router.get('/one/:id', notificacionesControlador_1.default.ObtenerUnaNotificacion);
        this.router.get('/send/:id_send', notificacionesControlador_1.default.ListaPorEmpleado);
        this.router.get('/all-receives/:id_receive', notificacionesControlador_1.default.ListaNotificacionesRecibidas);
        this.router.get('/receives/:id_receive', notificacionesControlador_1.default.ListaPorJefe);
        this.router.post('/', notificacionesControlador_1.default.create);
        this.router.put('/vista/:id', notificacionesControlador_1.default.ActualizarVista);
        // RUTAS CONFIG_NOTI
        this.router.get('/config/:id', notificacionesControlador_1.default.ObtenerConfigEmpleado);
        this.router.post('/config/', notificacionesControlador_1.default.CrearConfiguracion);
        this.router.put('/config/noti-put/:id', notificacionesControlador_1.default.ActualizarConfigEmpleado);
    }
}
const NOTIFICACION_TIEMPO_REAL_RUTAS = new NotificacionTiempoRealRutas();
exports.default = NOTIFICACION_TIEMPO_REAL_RUTAS.router;
