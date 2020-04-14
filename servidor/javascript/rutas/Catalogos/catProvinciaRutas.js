"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catProvinciaControlador_1 = __importDefault(require("../../controlador/Catalogos/catProvinciaControlador"));
class ProvinciaRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catProvinciaControlador_1.default.ListarProvincia);
        this.router.get('/continentes', catProvinciaControlador_1.default.ListarContinentes);
        this.router.get('/pais/:continente', catProvinciaControlador_1.default.ListarPaises);
        this.router.get('/nombreProvincia/:nombre', catProvinciaControlador_1.default.ObtenerIdProvincia);
        this.router.get('/:id_pais', catProvinciaControlador_1.default.ObtenerUnaProvincia);
        this.router.post('/', catProvinciaControlador_1.default.CrearProvincia);
    }
}
const PROVINCIA_RUTAS = new ProvinciaRutas();
exports.default = PROVINCIA_RUTAS.router;
