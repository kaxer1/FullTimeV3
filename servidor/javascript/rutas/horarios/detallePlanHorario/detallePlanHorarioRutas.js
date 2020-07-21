"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detallePlanHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/detallePlanHorario/detallePlanHorarioControlador"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});
class DetallePlanHorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', detallePlanHorarioControlador_1.default.ListarDetallePlanHorario);
        this.router.get('/infoPlan/:id_plan_horario', detallePlanHorarioControlador_1.default.EncontrarPlanHoraDetallesPorIdPlanHorario);
        this.router.post('/', detallePlanHorarioControlador_1.default.CrearDetallePlanHorario);
        this.router.post('/:id_plan_horario/upload', multipartMiddleware, detallePlanHorarioControlador_1.default.CrearDetallePlanificacionPlantilla);
    }
}
const DETALLE_PLAN_HORARIO_RUTAS = new DetallePlanHorarioRutas();
exports.default = DETALLE_PLAN_HORARIO_RUTAS.router;
