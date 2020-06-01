"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catProcesoControlador_1 = __importDefault(require("../../controlador/catalogos/catProcesoControlador"));
class ProcesoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catProcesoControlador_1.default.list);
        this.router.get('/busqueda/:nombre', catProcesoControlador_1.default.getIdByNombre);
        this.router.get('/:id', catProcesoControlador_1.default.getOne);
        this.router.post('/', catProcesoControlador_1.default.create);
        this.router.put('/', catProcesoControlador_1.default.ActualizarProceso);
        this.router.delete('/eliminar/:id', catProcesoControlador_1.default.EliminarProceso);
    }
}
const PROCESO_RUTAS = new ProcesoRutas();
exports.default = PROCESO_RUTAS.router;
