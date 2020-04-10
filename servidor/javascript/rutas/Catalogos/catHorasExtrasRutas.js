"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horasExtrasControlador_1 = __importDefault(require("../../controlador/Catalogos/horasExtrasControlador"));
class HorasExtrasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', horasExtrasControlador_1.default.list);
        this.router.get('/:id', horasExtrasControlador_1.default.getOne);
        this.router.post('/', horasExtrasControlador_1.default.create);
    }
}
const HORA_EXTRA_RUTA = new HorasExtrasRutas();
exports.default = HORA_EXTRA_RUTA.router;
