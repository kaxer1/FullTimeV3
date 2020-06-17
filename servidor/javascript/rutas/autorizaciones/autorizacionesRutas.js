"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autorizacionesControlador_1 = __importDefault(require("../../controlador/autorizaciones/autorizacionesControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', autorizacionesControlador_1.default.ListarAutorizaciones);
        this.router.get('/info-autorizacion/:id_documento', autorizacionesControlador_1.default.ObtenerAutorizacionPorIdDocumento);
        this.router.post('/', autorizacionesControlador_1.default.CrearAutorizacion);
        this.router.put('/:id/estado', autorizacionesControlador_1.default.ActualizarEstado);
    }
}
const AUTORIZA_DEPARTAMENTO_RUTAS = new DepartamentoRutas();
exports.default = AUTORIZA_DEPARTAMENTO_RUTAS.router;
