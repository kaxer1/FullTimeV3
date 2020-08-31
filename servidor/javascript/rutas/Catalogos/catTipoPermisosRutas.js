"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catTipoPermisosControlador_1 = __importDefault(require("../../controlador/catalogos/catTipoPermisosControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class TipoPermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catTipoPermisosControlador_1.default.list);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catTipoPermisosControlador_1.default.getOne);
        this.router.post('/', VerificarToken_1.TokenValidation, catTipoPermisosControlador_1.default.create);
        this.router.put('/editar/:id', VerificarToken_1.TokenValidation, catTipoPermisosControlador_1.default.editar);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catTipoPermisosControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catTipoPermisosControlador_1.default.downloadXML);
        this.router.get('/acceso/:acce_empleado', VerificarToken_1.TokenValidation, catTipoPermisosControlador_1.default.listAccess);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catTipoPermisosControlador_1.default.EliminarRegistros);
    }
}
const TIPO_PERMISOS_RUTAS = new TipoPermisosRutas();
exports.default = TIPO_PERMISOS_RUTAS.router;
