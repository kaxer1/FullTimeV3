"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoPermisosControlador_1 = __importDefault(require("../../controlador/catalogos/tipoPermisosControlador"));
class TipoPermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', tipoPermisosControlador_1.default.list);
        this.router.get('/:id', tipoPermisosControlador_1.default.getOne);
        this.router.post('/', tipoPermisosControlador_1.default.create);
    }
}
const tipoPermisosRutas = new TipoPermisosRutas();
exports.default = tipoPermisosRutas.router;
