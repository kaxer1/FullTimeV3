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
        this.router.get('/buscar/:nombre', catEmpresaControlador_1.default.ListarUnaEmpresa);
        this.router.post('/', catEmpresaControlador_1.default.CrearEmpresa);
        this.router.put('/', catEmpresaControlador_1.default.ActualizarEmpresa);
        this.router.post('/xmlDownload/', catEmpresaControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catEmpresaControlador_1.default.downloadXML);
    }
}
const EMPRESA_RUTAS = new DepartamentoRutas();
exports.default = EMPRESA_RUTAS.router;
