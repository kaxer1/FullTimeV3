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
        this.router.get('/', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.ListarTipoAccionPersonal);
        this.router.post('/', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.CrearTipoAccionPersonal);
        this.router.get('/tipo/accion/:id', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.EncontrarTipoAccionPersonalId);
        this.router.put('/', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.ActualizarTipoAccionPersonal);
        this.router.delete('/eliminar/:id', verificarToken_1.TokenValidation, accionPersonalControlador_1.default.EliminarTipoAccionPersonal);
    }
}
const ACCION_PERSONAL_RUTAS = new DepartamentoRutas();
exports.default = ACCION_PERSONAL_RUTAS.router;
