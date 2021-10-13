"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const salidaAntesControlador_1 = __importDefault(require("../../controlador/reportes/salidaAntesControlador"));
class SalidasAnticipadasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        // CONSULTA DE TIMBRES DE SALIDAS ACCION S
        this.router.put('/timbre-accions/:desde/:hasta', verificarToken_1.TokenValidation, salidaAntesControlador_1.default.BuscarTimbres_AccionS);
    }
}
const SALIDAS_ANTICIPADAS_RUTAS = new SalidasAnticipadasRutas();
exports.default = SALIDAS_ANTICIPADAS_RUTAS.router;
