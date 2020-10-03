"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datosGeneralesControlador_1 = __importDefault(require("../../controlador/datosGenerales/datosGeneralesControlador"));
const verificarToken_1 = require("../../libs/verificarToken");
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/empleadoAutoriza/:empleado_id', verificarToken_1.TokenValidation, datosGeneralesControlador_1.default.ListarDatosEmpleadoAutoriza);
    }
}
const DATOS_GENERALES_RUTAS = new CiudadRutas();
exports.default = DATOS_GENERALES_RUTAS.router;
