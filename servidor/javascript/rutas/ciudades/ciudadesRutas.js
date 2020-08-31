"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerificarToken_1 = require("../../libs/VerificarToken");
const ciudadControlador_1 = __importDefault(require("../../controlador/ciudad/ciudadControlador"));
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, ciudadControlador_1.default.ListarNombreCiudad);
        this.router.get('/listaCiudad', VerificarToken_1.TokenValidation, ciudadControlador_1.default.ListarCiudades);
        this.router.get('/:id', VerificarToken_1.TokenValidation, ciudadControlador_1.default.ConsularUnaCiudad);
        this.router.post('/', VerificarToken_1.TokenValidation, ciudadControlador_1.default.CrearCiudad);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, ciudadControlador_1.default.EliminarCiudad);
    }
}
const CIUDAD_RUTAS = new CiudadRutas();
exports.default = CIUDAD_RUTAS.router;
