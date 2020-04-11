"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRegimenControlador_1 = __importDefault(require("../../controlador/catalogos/catRegimenControlador"));
class RegimenRuta {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catRegimenControlador_1.default.ListarRegimen);
        this.router.get('/:id', catRegimenControlador_1.default.ListarUnRegimen);
        this.router.post('/', catRegimenControlador_1.default.CrearRegimen);
        // this.router.put('/:id', pruebaControlador.update);
        // this.router.delete('/:id', pruebaControlador.delete);
    }
}
const REGIMEN_RUTA = new RegimenRuta();
exports.default = REGIMEN_RUTA.router;
