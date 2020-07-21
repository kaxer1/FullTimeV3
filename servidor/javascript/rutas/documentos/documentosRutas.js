"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentosControlador_1 = __importDefault(require("../../controlador/documentos/documentosControlador"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './documentacion',
});
class DoumentosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', documentosControlador_1.default.ListarDocumentos);
        this.router.get('/:id', documentosControlador_1.default.ObtenerUnDocumento);
        this.router.post('/', documentosControlador_1.default.CrearDocumento);
        this.router.put('/editar/:id', documentosControlador_1.default.EditarDocumento);
        this.router.get('/documentos/:docs', documentosControlador_1.default.ObtenerDocumento);
        this.router.put('/:id/documento', multipartMiddleware, documentosControlador_1.default.GuardarDocumentos);
    }
}
const DOCUMENTOS_RUTAS = new DoumentosRutas();
exports.default = DOCUMENTOS_RUTAS.router;
