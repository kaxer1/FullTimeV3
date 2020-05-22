"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRelojesControlador_1 = __importDefault(require("../../controlador/catalogos/catRelojesControlador"));
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
        this.router.get('/', catRelojesControlador_1.default.ListarRelojes);
        this.router.get('/:id', catRelojesControlador_1.default.ListarUnReloj);
        this.router.post('/', catRelojesControlador_1.default.CrearRelojes);
        this.router.post('/plantillaExcel/', multipartMiddlewarePlantilla, catRelojesControlador_1.default.CargaPlantillaRelojes);
        // this.router.put('/:id', pruebaControlador.update);
        // this.router.delete('/:id', pruebaControlador.delete);
    }
}
const RELOJES_RUTA = new RelojesRuta();
exports.default = RELOJES_RUTA.router;
