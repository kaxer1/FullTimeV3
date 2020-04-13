"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRolPermisosControlador_1 = __importDefault(require("../../controlador/Catalogos/catRolPermisosControlador"));
class RolPermisosRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catRolPermisosControlador_1.default.list);
        this.router.get('/:id', catRolPermisosControlador_1.default.getOne);
        this.router.post('/', catRolPermisosControlador_1.default.create);
        this.router.post('/denegado/', catRolPermisosControlador_1.default.createPermisoDenegado);
        this.router.get('/denegado/:id', catRolPermisosControlador_1.default.getPermisosUsuario);
    }
}
const rolPermisosRutas = new RolPermisosRutas();
exports.default = rolPermisosRutas.router;
