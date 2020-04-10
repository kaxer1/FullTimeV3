"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catTipoComidasControlador_1 = __importDefault(require("../../controlador/Catalogos/catTipoComidasControlador"));
class TipoComidasRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catTipoComidasControlador_1.default.ListarTipoComidas);
        this.router.get('/:id', catTipoComidasControlador_1.default.ListarUnTipoComida);
        this.router.post('/', catTipoComidasControlador_1.default.CrearTipoComidas);
        // this.router.put('/:id', pruebaControlador.update);
        // this.router.delete('/:id', pruebaControlador.delete);
    }
}
const TIPO_COMIDAS_RUTA = new TipoComidasRuta();
exports.default = TIPO_COMIDAS_RUTA.router;
