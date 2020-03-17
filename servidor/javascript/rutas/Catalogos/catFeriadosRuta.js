"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catFeriadosControlador_1 = __importDefault(require("../../controlador/Catalogos/catFeriadosControlador"));
class FeriadosRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catFeriadosControlador_1.default.ListarFeriados);
        this.router.get('/buscarDescripcion/:descripcion', catFeriadosControlador_1.default.ListarFeriadoDescripcion);
        this.router.get('/buscarFecha/:fecha', catFeriadosControlador_1.default.ListarFeriadoFecha);
        this.router.post('/', catFeriadosControlador_1.default.CrearFeriados);
        this.router.put('/:id', catFeriadosControlador_1.default.ActualizarFeriado);
    }
}
const FERIADOS_RUTA = new FeriadosRuta();
exports.default = FERIADOS_RUTA.router;
