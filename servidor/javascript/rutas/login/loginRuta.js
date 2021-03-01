"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginControlador_1 = __importDefault(require("../../controlador/login/loginControlador"));
const verificarToken_1 = require("../../libs/verificarToken");
class LoginRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.post('/', loginControlador_1.default.ValidarCredenciales);
        this.router.post('/recuperar-contrasenia/', loginControlador_1.default.RestablecerContrasenia);
        this.router.post('/cambiar-contrasenia/', verificarToken_1.TokenValidation, loginControlador_1.default.CambiarContrasenia);
    }
}
const LOGIN_RUTA = new LoginRuta();
exports.default = LOGIN_RUTA.router;
