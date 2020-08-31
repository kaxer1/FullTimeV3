"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRelojesControlador_1 = __importDefault(require("../../controlador/catalogos/catRelojesControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddlewarePlantilla = multipart({
    uploadDir: './plantillas',
});
class RelojesRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catRelojesControlador_1.default.ListarRelojes);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catRelojesControlador_1.default.ListarUnReloj);
        this.router.post('/', VerificarToken_1.TokenValidation, catRelojesControlador_1.default.CrearRelojes);
        this.router.post('/plantillaExcel/', [VerificarToken_1.TokenValidation, multipartMiddlewarePlantilla], catRelojesControlador_1.default.CargaPlantillaRelojes);
        this.router.put('/', VerificarToken_1.TokenValidation, catRelojesControlador_1.default.ActualizarReloj);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catRelojesControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catRelojesControlador_1.default.downloadXML);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catRelojesControlador_1.default.EliminarRegistros);
        this.router.get('/datosReloj/:id', VerificarToken_1.TokenValidation, catRelojesControlador_1.default.ListarDatosUnReloj);
    }
}
const RELOJES_RUTA = new RelojesRuta();
exports.default = RELOJES_RUTA.router;
