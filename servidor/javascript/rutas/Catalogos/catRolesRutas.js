"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRolesControlador_1 = __importDefault(require("../../controlador/catalogos/catRolesControlador"));
class PruebasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catRolesControlador_1.default.list);
        this.router.get('/:id', catRolesControlador_1.default.getOne);
        this.router.post('/', catRolesControlador_1.default.create);
        // this.router.put('/:id', pruebaControlador.update);
        // this.router.delete('/:id', pruebaControlador.delete);
    }
}
const ROLES_RUTAS = new PruebasRutas();
exports.default = ROLES_RUTAS.router;
