"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoRegistro/empleadoControlador"));
class EmpleadoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', empleadoControlador_1.default.list);
        this.router.get('/nacionalidades', empleadoControlador_1.default.ListarNacionalidades);
        this.router.get('/:id', empleadoControlador_1.default.getOne);
        this.router.post('/', empleadoControlador_1.default.create);
        this.router.get('/emplTitulos/:id_empleado', empleadoControlador_1.default.getTitulosDelEmpleado);
        this.router.post('/emplTitulos/', empleadoControlador_1.default.createEmpleadoTitulos);
    }
}
const EMPLEADO_RUTAS = new EmpleadoRutas();
exports.default = EMPLEADO_RUTAS.router;
