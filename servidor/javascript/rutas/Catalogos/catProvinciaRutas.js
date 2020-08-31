"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catProvinciaControlador_1 = __importDefault(require("../../controlador/catalogos/catProvinciaControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class ProvinciaRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ListarProvincia);
        this.router.get('/paises', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ListarTodoPais);
        this.router.get('/continentes', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ListarContinentes);
        this.router.get('/pais/:continente', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ListarPaises);
        this.router.get('/nombreProvincia/:nombre', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ObtenerIdProvincia);
        this.router.get('/:id_pais', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ObtenerUnaProvincia);
        this.router.get('/buscar/:id', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ObtenerProvincia);
        this.router.get('/buscar/pais/:id', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.ObtenerPais);
        this.router.post('/', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.CrearProvincia);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catProvinciaControlador_1.default.EliminarProvincia);
    }
}
const PROVINCIA_RUTAS = new ProvinciaRutas();
exports.default = PROVINCIA_RUTAS.router;
