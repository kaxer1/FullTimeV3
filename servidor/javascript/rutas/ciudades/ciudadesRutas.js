"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ciudadControlador_1 = __importDefault(require("../../controlador/ciudad/ciudadControlador"));
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', ciudadControlador_1.default.ListarCiudad);
        this.router.get('/:id', ciudadControlador_1.default.ConsularUnaCiudad);
        this.router.post('/', ciudadControlador_1.default.CrearCiudad);
    }
}
const CIUDAD_RUTAS = new CiudadRutas();
exports.default = CIUDAD_RUTAS.router;
