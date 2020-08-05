"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catHorasExtrasControlador_1 = __importDefault(require("../../controlador/catalogos/catHorasExtrasControlador"));
class HorasExtrasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catHorasExtrasControlador_1.default.ListarHorasExtras);
        this.router.get('/:id', catHorasExtrasControlador_1.default.ObtenerUnaHoraExtra);
        this.router.post('/', catHorasExtrasControlador_1.default.CrearHoraExtra);
        this.router.delete('/eliminar/:id', catHorasExtrasControlador_1.default.EliminarRegistros);
        this.router.post('/xmlDownload/', catHorasExtrasControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catHorasExtrasControlador_1.default.downloadXML);
        this.router.put('/', catHorasExtrasControlador_1.default.ActualizarHoraExtra);
    }
}
const HORA_EXTRA_RUTA = new HorasExtrasRutas();
exports.default = HORA_EXTRA_RUTA.router;
