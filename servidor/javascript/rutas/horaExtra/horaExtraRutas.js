"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horaExtraControlador_1 = __importDefault(require("../../controlador/horaExtra/horaExtraControlador"));
const verificarToken_1 = require("../../libs/verificarToken");
class HorasExtrasPedidasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', verificarToken_1.TokenValidation, horaExtraControlador_1.default.ListarHorasExtrasPedidas);
        this.router.get('/:id', verificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerUnaHoraExtraPedida);
        this.router.get('/lista/:id_user', verificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerlistaHora);
        this.router.post('/', verificarToken_1.TokenValidation, horaExtraControlador_1.default.CrearHoraExtraPedida);
        this.router.post('/mail-noti/', verificarToken_1.TokenValidation, horaExtraControlador_1.default.SendMailNotifiPermiso);
        this.router.get('/datosSolicitud/:id_emple_hora', verificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerSolicitudHoraExtra);
        this.router.put('/:id/estado', verificarToken_1.TokenValidation, horaExtraControlador_1.default.ActualizarEstado);
        this.router.put('/:id/hora-extra-solicitada', verificarToken_1.TokenValidation, horaExtraControlador_1.default.EditarHoraExtra);
        this.router.get('/datosAutorizacion/:id_hora/:id_empleado', verificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerAutorizacionHoraExtra);
        this.router.get('/horario-empleado/:id_empleado', verificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerHorarioEmpleado);
        this.router.delete('/eliminar/:id_hora_extra', verificarToken_1.TokenValidation, horaExtraControlador_1.default.EliminarHoraExtra);
    }
}
const HORA_EXTRA_PEDIDA_RUTA = new HorasExtrasPedidasRutas();
exports.default = HORA_EXTRA_PEDIDA_RUTA.router;
