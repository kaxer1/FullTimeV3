"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const planHoraExtraControlador_1 = __importDefault(require("../../controlador/planHoraExtra/planHoraExtraControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', verificarToken_1.TokenValidation, planHoraExtraControlador_1.default.ListarPlanHoraExtra);
        this.router.get('/justificar', verificarToken_1.TokenValidation, planHoraExtraControlador_1.default.ListarPlanHoraExtraObserva);
        this.router.post('/', verificarToken_1.TokenValidation, planHoraExtraControlador_1.default.CrearPlanHoraExtra);
        this.router.put('/tiempo-autorizado/:id', verificarToken_1.TokenValidation, planHoraExtraControlador_1.default.TiempoAutorizado);
    }
}
const PLAN_HORA_EXTRA_RUTAS = new DepartamentoRutas();
exports.default = PLAN_HORA_EXTRA_RUTAS.router;
