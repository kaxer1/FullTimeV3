"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catEnroladoControlador_1 = __importDefault(require("../../controlador/catalogos/catEnroladoControlador"));
class EnroladoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catEnroladoControlador_1.default.ListarEnrolados);
        this.router.get('/:id', catEnroladoControlador_1.default.ObtenerUnEnrolado);
        this.router.post('/', catEnroladoControlador_1.default.CrearEnrolado);
        this.router.get('/busqueda/:id_usuario', catEnroladoControlador_1.default.ObtenerRegistroEnrolado);
        this.router.get('/buscar/ultimoId', catEnroladoControlador_1.default.ObtenerUltimoId);
        this.router.put('/', catEnroladoControlador_1.default.ActualizarEnrolado);
    }
}
const ENROLADO_RUTAS = new EnroladoRutas();
exports.default = ENROLADO_RUTAS.router;
