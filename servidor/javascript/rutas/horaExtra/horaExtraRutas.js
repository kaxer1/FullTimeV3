"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horaExtraControlador_1 = __importDefault(require("../../controlador/horaExtra/horaExtraControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class HorasExtrasPedidasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.ListarHorasExtrasPedidas);
        this.router.get('/:id', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerUnaHoraExtraPedida);
        this.router.get('/lista/:id_user', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerlistaHora);
        this.router.post('/', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.CrearHoraExtraPedida);
        this.router.post('/mail-noti/', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.SendMailNotifiPermiso);
        this.router.get('/datosSolicitud/:id_emple_hora', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerSolicitudHoraExtra);
        this.router.put('/:id/estado', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.ActualizarEstado);
        this.router.put('/:id/hora-extra-solicitada', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.EditarHoraExtra);
        this.router.get('/datosAutorizacion/:id_hora/:id_empleado', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerAutorizacionHoraExtra);
        this.router.get('/horario-empleado/:id_cargo', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.ObtenerHorarioEmpleado);
        this.router.delete('/eliminar/:id_hora_extra', VerificarToken_1.TokenValidation, horaExtraControlador_1.default.EliminarHoraExtra);
    }
}
const HORA_EXTRA_PEDIDA_RUTA = new HorasExtrasPedidasRutas();
exports.default = HORA_EXTRA_PEDIDA_RUTA.router;
