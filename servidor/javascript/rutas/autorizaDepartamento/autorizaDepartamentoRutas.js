"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autorizaDepartamentoControlador_1 = __importDefault(require("../../controlador/autorizaDepartamento/autorizaDepartamentoControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', autorizaDepartamentoControlador_1.default.ListarAutorizaDepartamento);
        this.router.post('/', autorizaDepartamentoControlador_1.default.CrearAutorizaDepartamento);
    }
}
const AUTORIZA_DEPARTAMENTO_RUTAS = new DepartamentoRutas();
exports.default = AUTORIZA_DEPARTAMENTO_RUTAS.router;
