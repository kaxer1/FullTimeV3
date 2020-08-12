"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleProcesoControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoProcesos/empleProcesoControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', empleProcesoControlador_1.default.ListarEmpleProcesos);
        this.router.get('/infoProceso/:id_empl_cargo', empleProcesoControlador_1.default.EncontrarProcesoPorIdCargo);
        this.router.post('/', empleProcesoControlador_1.default.CrearEmpleProcesos);
        this.router.put('/', empleProcesoControlador_1.default.ActualizarProcesoEmpleado);
        this.router.delete('/eliminar/:id', empleProcesoControlador_1.default.EliminarRegistros);
    }
}
const EMPLEADO_PROCESO_RUTAS = new DepartamentoRutas();
exports.default = EMPLEADO_PROCESO_RUTAS.router;
