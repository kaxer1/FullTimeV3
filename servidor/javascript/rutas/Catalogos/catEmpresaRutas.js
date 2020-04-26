"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catEmpresaControlador_1 = __importDefault(require("../../controlador/catalogos/catEmpresaControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catEmpresaControlador_1.default.ListarEmpresa);
        this.router.post('/', catEmpresaControlador_1.default.CrearEmpresa);
    }
}
const EMPRESA_RUTAS = new DepartamentoRutas();
exports.default = EMPRESA_RUTAS.router;
