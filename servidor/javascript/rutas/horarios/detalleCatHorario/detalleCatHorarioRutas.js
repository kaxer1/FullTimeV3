"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detalleCatHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/detalleCatHorario/detalleCatHorarioControlador"));
class PermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', detalleCatHorarioControlador_1.default.ListarDetalleHorarios);
        this.router.post('/', detalleCatHorarioControlador_1.default.CrearDetalleHorarios);
    }
}
const DETALLE_CATALOGO_HORARIO_RUTAS = new PermisosRutas();
exports.default = DETALLE_CATALOGO_HORARIO_RUTAS.router;
