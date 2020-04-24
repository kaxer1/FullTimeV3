"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NivelTituloControlador_1 = __importDefault(require("../../controlador/NivelTitulo/NivelTituloControlador"));
class NivelTituloRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', NivelTituloControlador_1.default.list);
        this.router.get('/:id', NivelTituloControlador_1.default.getOne);
        this.router.post('/', NivelTituloControlador_1.default.create);
    }
}
const nivelTituloRutas = new NivelTituloRutas();
exports.default = nivelTituloRutas.router;
