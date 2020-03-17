"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horarioControlador_1 = __importDefault(require("../../controlador/Catalogos/horarioControlador"));
class HorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', horarioControlador_1.default.list);
        this.router.get('/:id', horarioControlador_1.default.getOne);
        this.router.post('/', horarioControlador_1.default.create);
    }
}
const HORARIO_RUTAS = new HorarioRutas();
exports.default = HORARIO_RUTAS.router;
