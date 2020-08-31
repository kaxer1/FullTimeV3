"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permisosControlador_1 = __importDefault(require("../../controlador/permisos/permisosControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './docRespaldosPermisos',
});
class PermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, permisosControlador_1.default.ListarPermisos);
        this.router.get('/lista/', VerificarToken_1.TokenValidation, permisosControlador_1.default.ListarEstadosPermisos);
        this.router.get('/:id', VerificarToken_1.TokenValidation, permisosControlador_1.default.ObtenerUnPermiso);
        this.router.get('/un-permiso/:id_permiso', VerificarToken_1.TokenValidation, permisosControlador_1.default.ListarUnPermisoInfo);
        this.router.post('/', VerificarToken_1.TokenValidation, permisosControlador_1.default.CrearPermisos);
        this.router.post('/mail-noti/', VerificarToken_1.TokenValidation, permisosControlador_1.default.SendMailNotifiPermiso);
        this.router.get('/documentos/:docs', permisosControlador_1.default.getDoc);
        this.router.get('/numPermiso/:id_empleado', VerificarToken_1.TokenValidation, permisosControlador_1.default.ObtenerNumPermiso);
        this.router.get('/permisoContrato/:id_empl_contrato', VerificarToken_1.TokenValidation, permisosControlador_1.default.ObtenerPermisoContrato);
        this.router.put('/:id/documento', [VerificarToken_1.TokenValidation, multipartMiddleware], permisosControlador_1.default.guardarDocumentoPermiso);
        this.router.put('/:id/estado', VerificarToken_1.TokenValidation, permisosControlador_1.default.ActualizarEstado);
        this.router.put('/:id/permiso-solicitado', VerificarToken_1.TokenValidation, permisosControlador_1.default.EditarPermiso);
        this.router.get('/datosSolicitud/:id_emple_permiso', VerificarToken_1.TokenValidation, permisosControlador_1.default.ObtenerDatosSolicitud);
        this.router.get('/datosAutorizacion/:id_permiso/:id_empleado', VerificarToken_1.TokenValidation, permisosControlador_1.default.ObtenerDatosAutorizacion);
        this.router.delete('/eliminar/:id_permiso/:doc', VerificarToken_1.TokenValidation, permisosControlador_1.default.EliminarPermiso);
    }
}
const PERMISOS_RUTAS = new PermisosRutas();
exports.default = PERMISOS_RUTAS.router;
