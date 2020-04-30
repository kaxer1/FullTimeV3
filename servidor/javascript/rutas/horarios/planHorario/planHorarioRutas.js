"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/planHorario/planHorarioControlador"));
class PlanHorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', planHorarioControlador_1.default.ListarPlanHorario);
        this.router.post('/', planHorarioControlador_1.default.CrearPlanHorario);
        this.router.get('/buscar/:id_empleado', planHorarioControlador_1.default.EncontrarIdPlanHorario);
    }
}
const PLAN_HORARIO_RUTAS = new PlanHorarioRutas();
exports.default = PLAN_HORARIO_RUTAS.router;
