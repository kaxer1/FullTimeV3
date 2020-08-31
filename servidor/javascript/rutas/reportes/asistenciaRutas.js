"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asistenciaControlador_1 = __importDefault(require("../../controlador/reportes/asistenciaControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class AsistenciaRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/:id_empleado/:desde/:hasta', VerificarToken_1.TokenValidation, asistenciaControlador_1.default.ObtenerHorasTrabajadas);
        this.router.get('/lista-empleados/:id_empresa', VerificarToken_1.TokenValidation, asistenciaControlador_1.default.ObtenerListaEmpresa);
    }
}
const ASISTENCIA_RUTAS = new AsistenciaRutas();
exports.default = ASISTENCIA_RUTAS.router;
