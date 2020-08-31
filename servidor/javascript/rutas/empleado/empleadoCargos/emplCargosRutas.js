"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerificarToken_1 = require("../../../libs/VerificarToken");
const emplCargosControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoCargos/emplCargosControlador"));
class EmpleadosCargpsRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.list);
        this.router.get('/lista-empleados/', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.ListarCargoEmpleado);
        this.router.get('/empleadosAutorizan/:id', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.ListarEmpleadoAutoriza);
        this.router.get('/:id', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.getOne);
        this.router.get('/cargoInfo/:id_empl_contrato', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.EncontrarInfoCargoEmpleado);
        this.router.post('/', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.Crear);
        this.router.get('/buscar/:id_empleado', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.EncontrarIdCargo);
        this.router.get('/buscar/cargoActual/:id_empleado', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.EncontrarIdCargoActual);
        this.router.put('/:id_empl_contrato/:id/actualizar', VerificarToken_1.TokenValidation, emplCargosControlador_1.default.EditarCargo);
    }
}
const EMPLEADO_CARGO_RUTAS = new EmpleadosCargpsRutas();
exports.default = EMPLEADO_CARGO_RUTAS.router;
