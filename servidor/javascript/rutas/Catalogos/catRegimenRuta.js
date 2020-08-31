"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRegimenControlador_1 = __importDefault(require("../../controlador/catalogos/catRegimenControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class RegimenRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catRegimenControlador_1.default.ListarRegimen);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catRegimenControlador_1.default.ListarUnRegimen);
        this.router.post('/', VerificarToken_1.TokenValidation, catRegimenControlador_1.default.CrearRegimen);
        this.router.put('/', VerificarToken_1.TokenValidation, catRegimenControlador_1.default.ActualizarRegimen);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catRegimenControlador_1.default.EliminarRegistros);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catRegimenControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catRegimenControlador_1.default.downloadXML);
    }
}
const REGIMEN_RUTA = new RegimenRuta();
exports.default = REGIMEN_RUTA.router;
