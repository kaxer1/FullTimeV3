"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catHorarioControlador_1 = __importDefault(require("../../controlador/catalogos/catHorarioControlador"));
const verificarToken_1 = require("../../libs/verificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});
const multipartMiddlewareD = multipart({
    uploadDir: './docRespaldosHorarios',
});
class HorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', verificarToken_1.TokenValidation, catHorarioControlador_1.default.ListarHorarios);
        this.router.get('/:id', verificarToken_1.TokenValidation, catHorarioControlador_1.default.ObtenerUnHorario);
        this.router.post('/', verificarToken_1.TokenValidation, catHorarioControlador_1.default.CrearHorario);
        this.router.post('/cargaMultiple/upload', [verificarToken_1.TokenValidation, multipartMiddleware], catHorarioControlador_1.default.CrearHorarioyDetallePlantilla);
        this.router.put('/editar/:id', verificarToken_1.TokenValidation, catHorarioControlador_1.default.EditarHorario);
        this.router.post('/xmlDownload/', verificarToken_1.TokenValidation, catHorarioControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catHorarioControlador_1.default.downloadXML);
        this.router.get('/documentos/:docs', catHorarioControlador_1.default.ObtenerDocumento);
        this.router.put('/:id/documento', [verificarToken_1.TokenValidation, multipartMiddlewareD], catHorarioControlador_1.default.GuardarDocumentoHorario);
        this.router.put('/editar/editarDocumento/:id', verificarToken_1.TokenValidation, catHorarioControlador_1.default.EditarDocumento);
        this.router.post('/cargarHorario/upload', [verificarToken_1.TokenValidation, multipartMiddleware], catHorarioControlador_1.default.CargarHorarioPlantilla);
    }
}
const HORARIO_RUTAS = new HorarioRutas();
exports.default = HORARIO_RUTAS.router;
