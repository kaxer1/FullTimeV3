"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerificarToken_1 = require("../../../libs/VerificarToken");
const periodoVacacionControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoPeriodoVacacion/periodoVacacionControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, periodoVacacionControlador_1.default.ListarPerVacaciones);
        this.router.get('/infoPeriodo/:id_empl_contrato', VerificarToken_1.TokenValidation, periodoVacacionControlador_1.default.EncontrarPerVacacionesPorIdContrato);
        this.router.get('/buscar/:id_empleado', VerificarToken_1.TokenValidation, periodoVacacionControlador_1.default.EncontrarIdPerVacaciones);
        this.router.post('/', VerificarToken_1.TokenValidation, periodoVacacionControlador_1.default.CrearPerVacaciones);
        this.router.put('/', VerificarToken_1.TokenValidation, periodoVacacionControlador_1.default.ActualizarPeriodo);
    }
}
const PERIODO_VACACION__RUTAS = new DepartamentoRutas();
exports.default = PERIODO_VACACION__RUTAS.router;
