"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discapacidadControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoDiscapacidad/discapacidadControlador"));
class DiscapacidadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', discapacidadControlador_1.default.list);
        this.router.get('/:id_empleado', discapacidadControlador_1.default.getOne);
        this.router.post('/', discapacidadControlador_1.default.create);
        this.router.put('/:id_empleado', discapacidadControlador_1.default.update);
        this.router.delete('/eliminar/:id_empleado', discapacidadControlador_1.default.deleteDiscapacidad);
        // TIPO DISCAPACIDAD
        this.router.get('/buscarTipo/tipo', discapacidadControlador_1.default.ListarTipoD);
        this.router.get('/buscarTipo/tipo/:id', discapacidadControlador_1.default.ObtenerUnTipoD);
        this.router.post('/buscarTipo', discapacidadControlador_1.default.CrearTipoD);
        this.router.put('/buscarTipo/:id', discapacidadControlador_1.default.ActualizarTipoD);
        this.router.get('/buscarTipo/ultimoId', discapacidadControlador_1.default.ObtenerUltimoIdTD);
    }
}
const DISCAPACIDAD_RUTAS = new DiscapacidadRutas();
exports.default = DISCAPACIDAD_RUTAS.router;
