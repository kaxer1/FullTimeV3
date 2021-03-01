"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioControlador_1 = require("../../controlador/usuarios/usuarioControlador");
const verificarToken_1 = require("../../libs/verificarToken");
class UsuarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.list);
        this.router.post('/', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.create);
        this.router.get('/busqueda/:usuario', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.getIdByUsuario);
        this.router.get('/datos/:id_empleado', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.ObtenerDatosUsuario);
        this.router.put('/', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.CambiarPasswordUsuario);
        this.router.get('/noEnrolados', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.ListarUsuriosNoEnrolados);
        this.router.put('/actualizarDatos', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.ActualizarUsuario);
        this.router.post('/acceso', usuarioControlador_1.USUARIO_CONTROLADOR.AuditarAcceso);
        this.router.put('/frase', verificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.ActualizarFrase);
    }
}
const USUARIO_RUTA = new UsuarioRutas();
exports.default = USUARIO_RUTA.router;
