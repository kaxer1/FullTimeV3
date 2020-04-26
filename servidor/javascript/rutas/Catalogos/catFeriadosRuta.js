"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catFeriadosControlador_1 = __importDefault(require("../../controlador/catalogos/catFeriadosControlador"));
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
        this.router.get('/', catFeriadosControlador_1.default.ListarFeriados);
        this.router.get('/ultimoId', catFeriadosControlador_1.default.ObtenerUltimoId);
        this.router.get('/:id', catFeriadosControlador_1.default.ObtenerUnFeriado);
        this.router.post('/', catFeriadosControlador_1.default.CrearFeriados);
        this.router.post('/upload', multipartMiddleware, catFeriadosControlador_1.default.CrearFeriadoPlantilla);
        this.router.put('/', catFeriadosControlador_1.default.ActualizarFeriado);
    }
}
const FERIADOS_RUTA = new FeriadosRuta();
exports.default = FERIADOS_RUTA.router;
