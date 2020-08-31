"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoHorariosControlador_1 = __importDefault(require("../../../controlador/horarios/empleadoHorarios/empleadoHorariosControlador"));
const VerificarToken_1 = require("../../../libs/VerificarToken");
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
        this.router.get('/', VerificarToken_1.TokenValidation, empleadoHorariosControlador_1.default.ListarEmpleadoHorarios);
        this.router.post('/', VerificarToken_1.TokenValidation, empleadoHorariosControlador_1.default.CrearEmpleadoHorarios);
        this.router.get('/horarioCargo/:id_empl_cargo', VerificarToken_1.TokenValidation, empleadoHorariosControlador_1.default.ListarHorarioCargo);
        this.router.post('/upload/:id', [VerificarToken_1.TokenValidation, multipartMiddleware], empleadoHorariosControlador_1.default.CrearHorarioEmpleadoPlantilla);
        this.router.post('/cargaMultiple', [VerificarToken_1.TokenValidation, multipartMiddleware], empleadoHorariosControlador_1.default.CargarMultiplesHorariosEmpleadosPlantilla);
        this.router.post('/horas', VerificarToken_1.TokenValidation, empleadoHorariosControlador_1.default.ObtenerNumeroHoras);
        this.router.put('/', VerificarToken_1.TokenValidation, empleadoHorariosControlador_1.default.ActualizarEmpleadoHorarios);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, empleadoHorariosControlador_1.default.EliminarRegistros);
    }
}
const EMPLEADO_HORARIOS_RUTAS = new EmpleadoHorariosRutas();
exports.default = EMPLEADO_HORARIOS_RUTAS.router;
