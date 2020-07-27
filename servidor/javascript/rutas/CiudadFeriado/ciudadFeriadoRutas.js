"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ciudadFeriadoControlador_1 = __importDefault(require("../../controlador/ciudadFeriado/ciudadFeriadoControlador"));
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.post('/insertar', ciudadFeriadoControlador_1.default.AsignarCiudadFeriado);
        this.router.post('/buscar', ciudadFeriadoControlador_1.default.ObtenerIdCiudades);
        this.router.get('/:nombre', ciudadFeriadoControlador_1.default.FiltrarCiudadesProvincia);
        this.router.get('/nombresCiudades/:idferiado', ciudadFeriadoControlador_1.default.EncontrarCiudadesFeriado);
        this.router.put('/', ciudadFeriadoControlador_1.default.ActualizarCiudadFeriado);
        this.router.delete('/eliminar/:id', ciudadFeriadoControlador_1.default.EliminarCiudadFeriado);
    }
}
const CIUDAD_FERIADOS_RUTAS = new CiudadRutas();
exports.default = CIUDAD_FERIADOS_RUTAS.router;
