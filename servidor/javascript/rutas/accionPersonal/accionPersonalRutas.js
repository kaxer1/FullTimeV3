"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accionPersonalControlador_1 = __importDefault(require("../../controlador/accionPersonal/accionPersonalControlador"));
const verificarToken_1 = require("../../libs/verificarToken");
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        /** TABLA TIPO_ACCION_PERSONAL */
        this.router.get('/', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.ListarTipoAccionPersonal);
        this.router.post('/', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.CrearTipoAccionPersonal);
        this.router.get('/tipo/accion/:id', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.EncontrarTipoAccionPersonalId);
        this.router.put('/', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.ActualizarTipoAccionPersonal);
        this.router.delete('/eliminar/:id', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.EliminarTipoAccionPersonal);
        /** TABLA PROCESO_PROPUESTO */
        this.router.get('/proceso', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.ListarProcesosPropuestos);
        this.router.post('/proceso', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.CrearProcesoPropuesto);
        this.router.get('/tipo/proceso', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.EncontrarUltimoProceso);
        /** TABLA CARGO_PROPUESTO */
        this.router.get('/cargo', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.ListarCargoPropuestos);
        this.router.post('/cargo', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.CrearCargoPropuesto);
        this.router.get('/tipo/cargo', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.EncontrarUltimoCargoP);
        /** TABLA DECRETO_ACUERDO_RESOL */
        this.router.get('/decreto', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.ListarDecretos);
        this.router.post('/decreto', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.CrearDecreto);
        this.router.get('/tipo/decreto', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.EncontrarUltimoDecreto);
        /** TABLA PEDIDO_ACCION_EMPLEADO */
        this.router.post('/pedido/accion', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.CrearPedidoAccionPersonal);
    }
}
const ACCION_PERSONAL_RUTAS = new DepartamentoRutas();
exports.default = ACCION_PERSONAL_RUTAS.router;
