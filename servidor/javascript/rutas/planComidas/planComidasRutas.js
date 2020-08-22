"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const planComidasControlador_1 = __importDefault(require("../../controlador/planComidas/planComidasControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', verificarToken_1.TokenValidation, planComidasControlador_1.default.ListarPlanComidas);
        this.router.get('/infoComida/:id_empleado', verificarToken_1.TokenValidation, planComidasControlador_1.default.EncontrarPlanComidaPorIdEmpleado);
        this.router.post('/', verificarToken_1.TokenValidation, planComidasControlador_1.default.CrearPlanComidas);
        this.router.delete('/eliminar/:id', verificarToken_1.TokenValidation, planComidasControlador_1.default.EliminarRegistros);
        this.router.put('/', verificarToken_1.TokenValidation, planComidasControlador_1.default.ActualizarPlanComidas);
    }
}
const PLAN_COMIDAS_RUTAS = new DepartamentoRutas();
exports.default = PLAN_COMIDAS_RUTAS.router;
