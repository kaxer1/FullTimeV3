"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planComidasControlador_1 = __importDefault(require("../../controlador/planComidas/planComidasControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', planComidasControlador_1.default.ListarPlanComidas);
        this.router.post('/', planComidasControlador_1.default.CrearPlanComidas);
    }
}
const PLAN_COMIDAS_RUTAS = new DepartamentoRutas();
exports.default = PLAN_COMIDAS_RUTAS.router;
