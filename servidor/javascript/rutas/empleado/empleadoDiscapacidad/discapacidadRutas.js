"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discapacidadControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoDiscapacidad/discapacidadControlador"));
class DiscapacidadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', discapacidadControlador_1.default.list);
        this.router.get('/:id_empleado', discapacidadControlador_1.default.getOne);
        this.router.post('/', discapacidadControlador_1.default.create);
        this.router.put('/:id_empleado', discapacidadControlador_1.default.update);
    }
}
const discapacidadRutas = new DiscapacidadRutas();
exports.default = discapacidadRutas.router;
