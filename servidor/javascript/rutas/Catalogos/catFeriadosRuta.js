"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catFeriadosControlador_1 = __importDefault(require("../../controlador/catalogos/catFeriadosControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});
class FeriadosRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catFeriadosControlador_1.default.ListarFeriados);
        this.router.get('/ultimoId', VerificarToken_1.TokenValidation, catFeriadosControlador_1.default.ObtenerUltimoId);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catFeriadosControlador_1.default.ObtenerUnFeriado);
        this.router.post('/', VerificarToken_1.TokenValidation, catFeriadosControlador_1.default.CrearFeriados);
        this.router.post('/upload', [VerificarToken_1.TokenValidation, multipartMiddleware], catFeriadosControlador_1.default.CrearFeriadoPlantilla);
        this.router.put('/', VerificarToken_1.TokenValidation, catFeriadosControlador_1.default.ActualizarFeriado);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catFeriadosControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catFeriadosControlador_1.default.downloadXML);
        this.router.delete('/delete/:id', VerificarToken_1.TokenValidation, catFeriadosControlador_1.default.EliminarFeriado);
    }
}
const FERIADOS_RUTA = new FeriadosRuta();
exports.default = FERIADOS_RUTA.router;
