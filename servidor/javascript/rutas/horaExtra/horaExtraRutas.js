"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horaExtraControlador_1 = __importDefault(require("../../controlador/horaExtra/horaExtraControlador"));
class HorasExtrasPedidasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', horaExtraControlador_1.default.ListarHorasExtrasPedidas);
        this.router.get('/:id', horaExtraControlador_1.default.ObtenerUnaHoraExtraPedida);
        this.router.get('/lista/:id_user', horaExtraControlador_1.default.ObtenerlistaHora);
        this.router.post('/', horaExtraControlador_1.default.CrearHoraExtraPedida);
        this.router.put('/:id/estado', horaExtraControlador_1.default.ActualizarEstado);
    }
}
const HORA_EXTRA_PEDIDA_RUTA = new HorasExtrasPedidasRutas();
exports.default = HORA_EXTRA_PEDIDA_RUTA.router;
