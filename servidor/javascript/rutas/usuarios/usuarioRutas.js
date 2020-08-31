"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioControlador_1 = require("../../controlador/usuarios/usuarioControlador");
const VerificarToken_1 = require("../../libs/VerificarToken");
class UsuarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.list);
        this.router.post('/', VerificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.create);
        this.router.get('/busqueda/:usuario', VerificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.getIdByUsuario);
        this.router.get('/datos/:id_empleado', VerificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.ObtenerDatosUsuario);
        this.router.put('/', VerificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.CambiarPasswordUsuario);
        this.router.get('/noEnrolados', VerificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.ListarUsuriosNoEnrolados);
        this.router.put('/actualizarDatos', VerificarToken_1.TokenValidation, usuarioControlador_1.USUARIO_CONTROLADOR.ActualizarUsuario);
    }
}
const USUARIO_RUTA = new UsuarioRutas();
exports.default = USUARIO_RUTA.router;
