"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autorizacionesControlador_1 = __importDefault(require("../../controlador/autorizaciones/autorizacionesControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, autorizacionesControlador_1.default.ListarAutorizaciones);
        this.router.get('/by-permiso/:id_permiso', VerificarToken_1.TokenValidation, autorizacionesControlador_1.default.ObtenerAutorizacionByPermiso);
        this.router.get('/by-vacacion/:id_vacacion', VerificarToken_1.TokenValidation, autorizacionesControlador_1.default.ObtenerAutorizacionByVacacion);
        this.router.get('/by-hora-extra/:id_hora_extra', autorizacionesControlador_1.default.ObtenerAutorizacionByHoraExtra);
        this.router.post('/', VerificarToken_1.TokenValidation, autorizacionesControlador_1.default.CrearAutorizacion);
        this.router.put('/:id/estado-permiso', VerificarToken_1.TokenValidation, autorizacionesControlador_1.default.ActualizarEstadoPermiso);
        this.router.put('/:id/estado-vacacion', VerificarToken_1.TokenValidation, autorizacionesControlador_1.default.ActualizarEstadoVacacion);
        this.router.put('/:id/estado-hora-extra', VerificarToken_1.TokenValidation, autorizacionesControlador_1.default.ActualizarEstadoHoraExtra);
    }
}
const AUTORIZA_DEPARTAMENTO_RUTAS = new DepartamentoRutas();
exports.default = AUTORIZA_DEPARTAMENTO_RUTAS.router;
