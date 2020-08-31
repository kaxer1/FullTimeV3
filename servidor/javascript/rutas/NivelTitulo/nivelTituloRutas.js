"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nivelTituloControlador_1 = __importDefault(require("../../controlador/nivelTitulo/nivelTituloControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class NivelTituloRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, nivelTituloControlador_1.default.list);
        this.router.get('/:id', VerificarToken_1.TokenValidation, nivelTituloControlador_1.default.getOne);
        this.router.post('/', VerificarToken_1.TokenValidation, nivelTituloControlador_1.default.create);
        this.router.get('/buscar/:nombre', VerificarToken_1.TokenValidation, nivelTituloControlador_1.default.ObtenerNivelNombre);
        this.router.put('/', VerificarToken_1.TokenValidation, nivelTituloControlador_1.default.ActualizarNivelTitulo);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, nivelTituloControlador_1.default.EliminarNivelTitulo);
        this.router.get('/nivel/datos', VerificarToken_1.TokenValidation, nivelTituloControlador_1.default.ObtenerUltimoId);
    }
}
const NIVEL_TITULO_RUTAS = new NivelTituloRutas();
exports.default = NIVEL_TITULO_RUTAS.router;
