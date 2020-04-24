"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nivelTituloControlador_1 = __importDefault(require("../../controlador/nivelTitulo/nivelTituloControlador"));
class NivelTituloRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', nivelTituloControlador_1.default.list);
        this.router.get('/:id', nivelTituloControlador_1.default.getOne);
        this.router.post('/', nivelTituloControlador_1.default.create);
    }
}
const nivelTituloRutas = new NivelTituloRutas();
exports.default = nivelTituloRutas.router;
