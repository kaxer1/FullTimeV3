"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detalleCatHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/detalleCatHorario/detalleCatHorarioControlador"));
const VerificarToken_1 = require("../../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});
class PermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, detalleCatHorarioControlador_1.default.ListarDetalleHorarios);
        this.router.post('/', VerificarToken_1.TokenValidation, detalleCatHorarioControlador_1.default.CrearDetalleHorarios);
        this.router.get('/:id_horario', VerificarToken_1.TokenValidation, detalleCatHorarioControlador_1.default.ListarUnDetalleHorario);
        this.router.post('/upload', [VerificarToken_1.TokenValidation, multipartMiddleware], detalleCatHorarioControlador_1.default.CrearHorarioDetallePlantilla);
        this.router.put('/', VerificarToken_1.TokenValidation, detalleCatHorarioControlador_1.default.ActualizarDetalleHorarios);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, detalleCatHorarioControlador_1.default.EliminarRegistros);
    }
}
const DETALLE_CATALOGO_HORARIO_RUTAS = new PermisosRutas();
exports.default = DETALLE_CATALOGO_HORARIO_RUTAS.router;
