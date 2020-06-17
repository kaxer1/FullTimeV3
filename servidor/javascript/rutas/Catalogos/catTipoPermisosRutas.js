"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catTipoPermisosControlador_1 = __importDefault(require("../../controlador/catalogos/catTipoPermisosControlador"));
class TipoPermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catTipoPermisosControlador_1.default.list);
        this.router.get('/:id', catTipoPermisosControlador_1.default.getOne);
        this.router.post('/', catTipoPermisosControlador_1.default.create);
        this.router.put('/editar/:id', catTipoPermisosControlador_1.default.editar);
        this.router.post('/xmlDownload/', catTipoPermisosControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catTipoPermisosControlador_1.default.downloadXML);
        this.router.get('/acceso/:acce_empleado', catTipoPermisosControlador_1.default.listAccess);
    }
}
const TIPO_PERMISOS_RUTAS = new TipoPermisosRutas();
exports.default = TIPO_PERMISOS_RUTAS.router;
