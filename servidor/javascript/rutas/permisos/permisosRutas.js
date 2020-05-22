"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permisosControlador_1 = __importDefault(require("../../controlador/permisos/permisosControlador"));
class PermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', permisosControlador_1.default.ListarPermisos);
        this.router.post('/', permisosControlador_1.default.CrearPermisos);
        this.router.get('/numPermiso/:id_empleado', permisosControlador_1.default.ObtenerNumPermiso);
        this.router.get('/permisoContrato/:id_empl_contrato', permisosControlador_1.default.ObtenerPermisoContrato);
    }
}
const PERMISOS_RUTAS = new PermisosRutas();
exports.default = PERMISOS_RUTAS.router;
