"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catEmpresaControlador_1 = __importDefault(require("../../controlador/catalogos/catEmpresaControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './logos',
});
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.ListarEmpresa);
        this.router.get('/buscar/:nombre', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.ListarUnaEmpresa);
        this.router.post('/', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.CrearEmpresa);
        this.router.put('/', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.ActualizarEmpresa);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catEmpresaControlador_1.default.downloadXML);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.EliminarRegistros);
        this.router.get('/buscar/datos/:id', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.ListarEmpresaId);
        this.router.get('/logo/codificado/:id_empresa', VerificarToken_1.TokenValidation, catEmpresaControlador_1.default.getImagenBase64);
        this.router.put('/logo/:id_empresa/uploadImage', [VerificarToken_1.TokenValidation, multipartMiddleware], catEmpresaControlador_1.default.ActualizarLogoEmpresa);
    }
}
const EMPRESA_RUTAS = new DepartamentoRutas();
exports.default = EMPRESA_RUTAS.router;
