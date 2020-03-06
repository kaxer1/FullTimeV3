"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provinciaControlador_1 = __importDefault(require("../../controlador/Catalogos/provinciaControlador"));
class ProvinciaRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', provinciaControlador_1.default.list);
        this.router.get('/:id', provinciaControlador_1.default.getOne);
        this.router.post('/', provinciaControlador_1.default.create);
    }
}
const PROVINCIA_RUTAS = new ProvinciaRutas();
exports.default = PROVINCIA_RUTAS.router;
