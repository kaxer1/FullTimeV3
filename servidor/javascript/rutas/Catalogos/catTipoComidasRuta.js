"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catTipoComidasControlador_1 = __importDefault(require("../../controlador/catalogos/catTipoComidasControlador"));
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
        this.router.get('/', catTipoComidasControlador_1.default.ListarTipoComidas);
        this.router.get('/:id', catTipoComidasControlador_1.default.ListarUnTipoComida);
        this.router.post('/', catTipoComidasControlador_1.default.CrearTipoComidas);
        this.router.put('/', catTipoComidasControlador_1.default.ActualizarComida);
        // this.router.delete('/:id', pruebaControlador.delete);
        this.router.post('/xmlDownload/', catTipoComidasControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catTipoComidasControlador_1.default.downloadXML);
        this.router.post('/upload', multipartMiddleware, catTipoComidasControlador_1.default.CrearTipoComidasPlantilla);
    }
}
const TIPO_COMIDAS_RUTA = new TipoComidasRuta();
exports.default = TIPO_COMIDAS_RUTA.router;
