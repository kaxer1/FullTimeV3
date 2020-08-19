"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportesControlador_1 = __importDefault(require("../../controlador/reportes/reportesControlador"));
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/horasExtrasReales', reportesControlador_1.default.ListarDatosContractoA);
        this.router.get('/horasExtrasReales/:empleado_id', reportesControlador_1.default.ListarDatosCargoA);
    }
}
const REPORTES_RUTAS = new CiudadRutas();
exports.default = REPORTES_RUTAS.router;
