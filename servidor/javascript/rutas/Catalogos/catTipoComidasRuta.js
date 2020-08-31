"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catTipoComidasControlador_1 = __importDefault(require("../../controlador/catalogos/catTipoComidasControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});
class TipoComidasRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catTipoComidasControlador_1.default.ListarTipoComidas);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catTipoComidasControlador_1.default.ListarUnTipoComida);
        this.router.post('/', VerificarToken_1.TokenValidation, catTipoComidasControlador_1.default.CrearTipoComidas);
        this.router.put('/', VerificarToken_1.TokenValidation, catTipoComidasControlador_1.default.ActualizarComida);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catTipoComidasControlador_1.default.EliminarRegistros);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catTipoComidasControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catTipoComidasControlador_1.default.downloadXML);
        this.router.post('/upload', VerificarToken_1.TokenValidation, multipartMiddleware, catTipoComidasControlador_1.default.CrearTipoComidasPlantilla);
    }
}
const TIPO_COMIDAS_RUTA = new TipoComidasRuta();
exports.default = TIPO_COMIDAS_RUTA.router;
