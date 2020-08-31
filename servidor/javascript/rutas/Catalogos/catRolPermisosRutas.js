"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRolPermisosControlador_1 = __importDefault(require("../../controlador/catalogos/catRolPermisosControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class RolPermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catRolPermisosControlador_1.default.list);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catRolPermisosControlador_1.default.getOne);
        this.router.post('/', VerificarToken_1.TokenValidation, catRolPermisosControlador_1.default.create);
        this.router.post('/denegado/', VerificarToken_1.TokenValidation, catRolPermisosControlador_1.default.createPermisoDenegado);
        this.router.get('/denegado/:id', VerificarToken_1.TokenValidation, catRolPermisosControlador_1.default.getPermisosUsuario);
    }
}
const rolPermisosRutas = new RolPermisosRutas();
exports.default = rolPermisosRutas.router;
