"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enroladoControlador_1 = __importDefault(require("../../controlador/catalogos/enroladoControlador"));
class EnroladoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', enroladoControlador_1.default.list);
        this.router.get('/:id', enroladoControlador_1.default.getOne);
        this.router.post('/', enroladoControlador_1.default.create);
        this.router.get('/busqueda/:nombre', enroladoControlador_1.default.getIdByNombre);
    }
}
const ENROLADO_RUTAS = new EnroladoRutas();
exports.default = ENROLADO_RUTAS.router;
