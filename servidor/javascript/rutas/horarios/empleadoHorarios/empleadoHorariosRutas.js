"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoHorariosControlador_1 = __importDefault(require("../../../controlador/horarios/empleadoHorarios/empleadoHorariosControlador"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});
class EmpleadoHorariosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', empleadoHorariosControlador_1.default.ListarEmpleadoHorarios);
        this.router.post('/', empleadoHorariosControlador_1.default.CrearEmpleadoHorarios);
        this.router.get('/horarioCargo/:id_empl_cargo', empleadoHorariosControlador_1.default.ListarHorarioCargo);
        this.router.post('/upload/:id', multipartMiddleware, empleadoHorariosControlador_1.default.CrearHorarioEmpleadoPlantilla);
        this.router.post('/cargaMultiple', multipartMiddleware, empleadoHorariosControlador_1.default.CargarMultiplesHorariosEmpleadosPlantilla);
        this.router.post('/horas', empleadoHorariosControlador_1.default.ObtenerNumeroHoras);
    }
}
const EMPLEADO_HORARIOS_RUTAS = new EmpleadoHorariosRutas();
exports.default = EMPLEADO_HORARIOS_RUTAS.router;
