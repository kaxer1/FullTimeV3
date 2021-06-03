"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reporteNotificacionControlador_1 = __importDefault(require("../../controlador/reportes/reporteNotificacionControlador"));
class NotificacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/permisos_enviados/:envia', reporteNotificacionControlador_1.default.ListarPermisosEnviados);
        this.router.get('/permisos_recibidos/:recibe', reporteNotificacionControlador_1.default.ListarPermisosRecibidos);
        this.router.get('/solicita_extra_enviados/:envia', reporteNotificacionControlador_1.default.ListarSolicitudHoraExtraEnviadas);
        this.router.get('/solicita_extra_recibidos/:recibe', reporteNotificacionControlador_1.default.ListarSolicitudHoraExtraRecibidas);
        this.router.get('/vacaciones_enviados/:envia', reporteNotificacionControlador_1.default.ListarVacacionesEnviadas);
        this.router.get('/vacaciones_recibidos/:recibe', reporteNotificacionControlador_1.default.ListarVacacionesRecibidas);
        this.router.get('/planificaciones_enviadas/:envia', reporteNotificacionControlador_1.default.ListarPlanificaComidaEnviadas);
        this.router.get('/planificaciones_eliminadas/:envia', reporteNotificacionControlador_1.default.ListarPlanificacionesEliminadas);
    }
}
const NOTIFICACION_RUTAS = new NotificacionesRutas();
exports.default = NOTIFICACION_RUTAS.router;
