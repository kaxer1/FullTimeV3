"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contratoEmpleadoControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoContrato/contratoEmpleadoControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', contratoEmpleadoControlador_1.default.ListarContratos);
        this.router.get('/:id_empleado', contratoEmpleadoControlador_1.default.EncontrarIdContrato);
        this.router.post('/', contratoEmpleadoControlador_1.default.CrearContrato);
    }
}
const CONTRATO_EMPLEADO_RUTAS = new DepartamentoRutas();
exports.default = CONTRATO_EMPLEADO_RUTAS.router;
