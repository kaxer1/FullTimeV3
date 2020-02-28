"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pruebaControlador_1 = __importDefault(require("../controlador/pruebaControlador"));
class PruebasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', pruebaControlador_1.default.list);
        this.router.get('/:id', pruebaControlador_1.default.getOne);
        this.router.post('/', pruebaControlador_1.default.create);
        this.router.put('/:id', pruebaControlador_1.default.update);
        this.router.delete('/:id', pruebaControlador_1.default.delete);
    }
}
const pruebasRutas = new PruebasRutas();
exports.default = pruebasRutas.router;
