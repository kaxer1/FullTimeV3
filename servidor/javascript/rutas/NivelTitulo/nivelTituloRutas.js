"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NivelTituloControlador_1 = __importDefault(require("../../controlador/nivelTitulo/NivelTituloControlador"));
class NivelTituloRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', NivelTituloControlador_1.default.list);
        this.router.get('/:id', NivelTituloControlador_1.default.getOne);
        this.router.post('/', NivelTituloControlador_1.default.create);
        this.router.get('/buscar/:nombre', NivelTituloControlador_1.default.ObtenerNivelNombre);
        this.router.put('/', NivelTituloControlador_1.default.ActualizarNivelTitulo);
        this.router.delete('/eliminar/:id', NivelTituloControlador_1.default.EliminarNivelTitulo);
    }
}
const NIVEL_TITULO_RUTAS = new NivelTituloRutas();
exports.default = NIVEL_TITULO_RUTAS.router;
