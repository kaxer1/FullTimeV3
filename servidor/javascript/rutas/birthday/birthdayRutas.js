"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const birthdayControlador_1 = __importDefault(require("../../controlador/birthday/birthdayControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './cumpleanios',
});
class BirthdayRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/:id_empresa', VerificarToken_1.TokenValidation, birthdayControlador_1.default.MensajeEmpresa);
        this.router.get('/img/:imagen', birthdayControlador_1.default.getImagen);
        this.router.post('/', VerificarToken_1.TokenValidation, birthdayControlador_1.default.CrearMensajeBirthday);
        this.router.put('/:id_empresa/uploadImage', [VerificarToken_1.TokenValidation, multipartMiddleware], birthdayControlador_1.default.CrearImagenEmpleado);
        this.router.put('/editar/:id_mensaje', VerificarToken_1.TokenValidation, birthdayControlador_1.default.EditarMensajeBirthday);
    }
}
const BIRTHDAY_RUTAS = new BirthdayRutas();
exports.default = BIRTHDAY_RUTAS.router;
