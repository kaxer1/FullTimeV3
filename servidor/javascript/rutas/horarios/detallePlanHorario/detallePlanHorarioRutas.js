"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detallePlanHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/detallePlanHorario/detallePlanHorarioControlador"));
class DetallePlanHorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', detallePlanHorarioControlador_1.default.ListarDetallePlanHorario);
        this.router.post('/', detallePlanHorarioControlador_1.default.CrearDetallePlanHorario);
    }
}
const DETALLE_PLAN_HORARIO_RUTAS = new DetallePlanHorarioRutas();
exports.default = DETALLE_PLAN_HORARIO_RUTAS.router;
