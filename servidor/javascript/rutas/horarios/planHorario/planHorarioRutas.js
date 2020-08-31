"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/planHorario/planHorarioControlador"));
const VerificarToken_1 = require("../../../libs/VerificarToken");
class PlanHorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, planHorarioControlador_1.default.ListarPlanHorario);
        this.router.post('/', VerificarToken_1.TokenValidation, planHorarioControlador_1.default.CrearPlanHorario);
        this.router.get('/buscar/:id_empleado', VerificarToken_1.TokenValidation, planHorarioControlador_1.default.EncontrarIdPlanHorario);
        this.router.get('/infoPlan/:id_cargo', VerificarToken_1.TokenValidation, planHorarioControlador_1.default.EncontrarPlanHorarioPorIdCargo);
        this.router.get('/datosPlanHorario/:id', VerificarToken_1.TokenValidation, planHorarioControlador_1.default.EncontrarPlanHorarioPorId);
        this.router.put('/', VerificarToken_1.TokenValidation, planHorarioControlador_1.default.ActualizarPlanHorario);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, planHorarioControlador_1.default.EliminarRegistros);
    }
}
const PLAN_HORARIO_RUTAS = new PlanHorarioRutas();
exports.default = PLAN_HORARIO_RUTAS.router;
