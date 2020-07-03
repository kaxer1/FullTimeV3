"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vacacionesControlador_1 = __importDefault(require("../../controlador/vacaciones/vacacionesControlador"));
class SucursalRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', vacacionesControlador_1.default.ListarVacaciones);
        this.router.get('/:id', vacacionesControlador_1.default.VacacionesIdPeriodo);
        this.router.get('/one/:id', vacacionesControlador_1.default.ListarUnaVacacion);
        this.router.post('/', vacacionesControlador_1.default.CrearVacaciones);
        this.router.post('/fechasFeriado', vacacionesControlador_1.default.ObtenerFechasFeriado);
        this.router.put('/:id/estado', vacacionesControlador_1.default.ActualizarEstado);
    }
}
const SUCURSAL_RUTAS = new SucursalRutas();
exports.default = SUCURSAL_RUTAS.router;
