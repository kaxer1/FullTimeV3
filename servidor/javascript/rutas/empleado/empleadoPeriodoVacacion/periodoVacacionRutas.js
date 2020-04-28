"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const periodoVacacionControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoPeriodoVacacion/periodoVacacionControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', periodoVacacionControlador_1.default.ListarPerVacaciones);
        this.router.post('/', periodoVacacionControlador_1.default.CrearPerVacaciones);
    }
}
const PERIODO_VACACION__RUTAS = new DepartamentoRutas();
exports.default = PERIODO_VACACION__RUTAS.router;
