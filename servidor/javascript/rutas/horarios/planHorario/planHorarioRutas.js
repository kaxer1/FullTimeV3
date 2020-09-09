"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/planHorario/planHorarioControlador"));
const verificarToken_1 = require("../../../libs/verificarToken");
class PlanHorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', verificarToken_1.TokenValidation, planHorarioControlador_1.default.ListarPlanHorario);
        this.router.post('/', verificarToken_1.TokenValidation, planHorarioControlador_1.default.CrearPlanHorario);
        this.router.get('/buscar/:id_empleado', verificarToken_1.TokenValidation, planHorarioControlador_1.default.EncontrarIdPlanHorario);
        this.router.get('/infoPlan/:id_cargo', verificarToken_1.TokenValidation, planHorarioControlador_1.default.EncontrarPlanHorarioPorIdCargo);
        this.router.get('/datosPlanHorario/:id', verificarToken_1.TokenValidation, planHorarioControlador_1.default.EncontrarPlanHorarioPorId);
        this.router.put('/', verificarToken_1.TokenValidation, planHorarioControlador_1.default.ActualizarPlanHorario);
        this.router.delete('/eliminar/:id', verificarToken_1.TokenValidation, planHorarioControlador_1.default.EliminarRegistros);
        this.router.post('/fechas_plan/:id_empleado', verificarToken_1.TokenValidation, planHorarioControlador_1.default.ObtenerPlanificacionEmpleadoFechas);
    }
}
const PLAN_HORARIO_RUTAS = new PlanHorarioRutas();
exports.default = PLAN_HORARIO_RUTAS.router;
