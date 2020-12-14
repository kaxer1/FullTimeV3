"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const graficasControlador_1 = __importDefault(require("../../controlador/graficas/graficasControlador"));
class GraficasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/inasistencia', verificarToken_1.TokenValidation, graficasControlador_1.default.ObtenerInasistencia);
        // this.router.post('/insertar', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.AsignarRelojEnrolado);
        // this.router.post('/buscar', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.ObtenerIdReloj);
        // this.router.put('/', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.ActualizarRelojEnrolado);
        // this.router.delete('/eliminar/:id', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.EliminarRelojEnrolado);
    }
}
const GRAFICAS_RUTAS = new GraficasRutas();
exports.default = GRAFICAS_RUTAS.router;
