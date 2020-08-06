"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catTituloControlador_1 = __importDefault(require("../../controlador/catalogos/catTituloControlador"));
class TituloRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catTituloControlador_1.default.list);
        this.router.get('/:id', catTituloControlador_1.default.getOne);
        this.router.post('/', catTituloControlador_1.default.create);
        this.router.put('/', catTituloControlador_1.default.ActualizarTitulo);
        this.router.delete('/eliminar/:id', catTituloControlador_1.default.EliminarRegistros);
    }
}
const TITULO_RUTAS = new TituloRutas();
exports.default = TITULO_RUTAS.router;
