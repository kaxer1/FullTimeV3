"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catEmpresaControlador_1 = __importDefault(require("../../controlador/catalogos/catEmpresaControlador"));
const verificarToken_1 = require("../../libs/verificarToken");
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', verificarToken_1.TokenValidation, catEmpresaControlador_1.default.ListarEmpresa);
        this.router.get('/buscar/:nombre', verificarToken_1.TokenValidation, catEmpresaControlador_1.default.ListarUnaEmpresa);
        this.router.post('/', verificarToken_1.TokenValidation, catEmpresaControlador_1.default.CrearEmpresa);
        this.router.put('/', verificarToken_1.TokenValidation, catEmpresaControlador_1.default.ActualizarEmpresa);
        this.router.post('/xmlDownload/', verificarToken_1.TokenValidation, catEmpresaControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catEmpresaControlador_1.default.downloadXML);
        this.router.delete('/eliminar/:id', verificarToken_1.TokenValidation, catEmpresaControlador_1.default.EliminarRegistros);
        this.router.get('/buscar/datos/:id', verificarToken_1.TokenValidation, catEmpresaControlador_1.default.ListarEmpresaId);
    }
}
const EMPRESA_RUTAS = new DepartamentoRutas();
exports.default = EMPRESA_RUTAS.router;
