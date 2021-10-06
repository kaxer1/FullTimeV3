"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditoriaControlador_1 = __importDefault(require("../../controlador/auditoria/auditoriaControlador"));
const verificarToken_1 = require("../../libs/verificarToken");
class AuditoriaRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.post('/auditar', verificarToken_1.TokenValidation, auditoriaControlador_1.default.BuscarDatosAuditoria);
    }
}
const AUDITORIA_RUTAS = new AuditoriaRutas();
exports.default = AUDITORIA_RUTAS.router;
