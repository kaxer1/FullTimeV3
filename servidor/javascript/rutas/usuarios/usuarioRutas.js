"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioControlador_1 = require("../../controlador/usuarios/usuarioControlador");
class UsuarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', usuarioControlador_1.USUARIO_CONTROLADOR.list);
        this.router.post('/', usuarioControlador_1.USUARIO_CONTROLADOR.create);
        this.router.get('/busqueda/:usuario', usuarioControlador_1.USUARIO_CONTROLADOR.getIdByUsuario);
        this.router.get('/datos/:id_empleado', usuarioControlador_1.USUARIO_CONTROLADOR.ObtenerDatosUsuario);
        this.router.put('/', usuarioControlador_1.USUARIO_CONTROLADOR.CambiarPasswordUsuario);
    }
}
const USUARIO_RUTA = new UsuarioRutas();
exports.default = USUARIO_RUTA.router;
