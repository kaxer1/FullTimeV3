"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerificarToken_1 = require("../../libs/VerificarToken");
const planComidasControlador_1 = __importDefault(require("../../controlador/planComidas/planComidasControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, planComidasControlador_1.default.ListarPlanComidas);
        this.router.get('/infoComida/:id_empleado', VerificarToken_1.TokenValidation, planComidasControlador_1.default.EncontrarPlanComidaPorIdEmpleado);
        this.router.post('/', VerificarToken_1.TokenValidation, planComidasControlador_1.default.CrearPlanComidas);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, planComidasControlador_1.default.EliminarRegistros);
        this.router.put('/', VerificarToken_1.TokenValidation, planComidasControlador_1.default.ActualizarPlanComidas);
    }
}
const PLAN_COMIDAS_RUTAS = new DepartamentoRutas();
exports.default = PLAN_COMIDAS_RUTAS.router;
