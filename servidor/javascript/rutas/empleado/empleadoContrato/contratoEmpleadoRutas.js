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
        this.router.get('/:id/get', contratoEmpleadoControlador_1.default.ObtenerUnContrato);
        this.router.get('/:id_empleado', contratoEmpleadoControlador_1.default.EncontrarIdContrato);
        this.router.get('/contrato/:id_empleado', contratoEmpleadoControlador_1.default.EncontrarContratoIdEmpleado);
        this.router.get('/contratoRegimen/:id_empleado', contratoEmpleadoControlador_1.default.EncontrarContratoEmpleadoRegimen);
        this.router.post('/', contratoEmpleadoControlador_1.default.CrearContrato);
        this.router.put('/:id_empleado/:id/actualizar', contratoEmpleadoControlador_1.default.EditarContrato);
    }
}
const CONTRATO_EMPLEADO_RUTAS = new DepartamentoRutas();
exports.default = CONTRATO_EMPLEADO_RUTAS.router;
