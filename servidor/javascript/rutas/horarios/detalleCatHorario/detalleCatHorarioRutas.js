"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detalleCatHorarioControlador_1 = __importDefault(require("../../../controlador/horarios/detalleCatHorario/detalleCatHorarioControlador"));
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
        this.router.get('/', detalleCatHorarioControlador_1.default.ListarDetalleHorarios);
        this.router.post('/', detalleCatHorarioControlador_1.default.CrearDetalleHorarios);
        this.router.get('/:id_horario', detalleCatHorarioControlador_1.default.ListarUnDetalleHorario);
        this.router.post('/upload', multipartMiddleware, detalleCatHorarioControlador_1.default.CrearHorarioDetallePlantilla);
    }
}
const DETALLE_CATALOGO_HORARIO_RUTAS = new PermisosRutas();
exports.default = DETALLE_CATALOGO_HORARIO_RUTAS.router;
