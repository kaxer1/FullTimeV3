"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emplCargosControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoCargos/emplCargosControlador"));
class EmpleadosCargpsRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', emplCargosControlador_1.default.list);
        this.router.get('/:id', emplCargosControlador_1.default.getOne);
        this.router.post('/', emplCargosControlador_1.default.Crear);
    }
}
const EMPLEADO_CARGO_RUTAS = new EmpleadosCargpsRutas();
exports.default = EMPLEADO_CARGO_RUTAS.router;
