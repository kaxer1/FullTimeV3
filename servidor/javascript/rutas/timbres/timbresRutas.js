"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const timbresControlador_1 = __importDefault(require("../../controlador/timbres/timbresControlador"));
class TimbresRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/noti-timbres/:id_empleado', verificarToken_1.TokenValidation, timbresControlador_1.default.ObtenerRealTimeTimbresEmpleado);
        this.router.put('/noti-timbres/vista/:id_noti_timbre', verificarToken_1.TokenValidation, timbresControlador_1.default.ActualizarVista);
        // this.router.post('/mail-noti/', TokenValidation, TIMBRES_CONTROLADOR.SendMailNotifiPermiso);
        // this.router.put('/:id/estado', TokenValidation, TIMBRES_CONTROLADOR.ActualizarEstado);
        // this.router.delete('/eliminar/:id_vacacion', TokenValidation, TIMBRES_CONTROLADOR.EliminarVacaciones);
    }
}
const TIMBRES_RUTAS = new TimbresRutas();
exports.default = TIMBRES_RUTAS.router;