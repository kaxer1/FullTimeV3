"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departamentoControlador_1 = __importDefault(require("../../controlador/Catalogos/departamentoControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', departamentoControlador_1.default.list);
        this.router.get('/:id', departamentoControlador_1.default.getOne);
        this.router.post('/', departamentoControlador_1.default.create);
    }
}
const DEPARTAMENTO_RUTAS = new DepartamentoRutas();
exports.default = DEPARTAMENTO_RUTAS.router;
