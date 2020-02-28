"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoControlador_1 = __importDefault(require("../controlador/empleadoControlador"));
class EmpleadoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', empleadoControlador_1.default.list);
        this.router.get('/:id', empleadoControlador_1.default.getOne);
    }
}
const empleadoRutas = new EmpleadoRutas();
exports.default = empleadoRutas.router;
