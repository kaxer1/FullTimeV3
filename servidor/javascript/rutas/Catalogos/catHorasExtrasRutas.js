"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
<<<<<<< HEAD
const catHorasExtrasControlador_1 = __importDefault(require("../../controlador/catalogos/catHorasExtrasControlador"));
=======
const horasExtrasControlador_1 = __importDefault(require("../../controlador/Catalogos/horasExtrasControlador"));
>>>>>>> 06167363ec0cb38bfe8074c610dd2718b80dcecf
class HorasExtrasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catHorasExtrasControlador_1.default.ListarHorasExtras);
        this.router.get('/:id', catHorasExtrasControlador_1.default.ObtenerUnaHoraExtra);
        this.router.post('/', catHorasExtrasControlador_1.default.CrearHoraExtra);
    }
}
const HORA_EXTRA_RUTA = new HorasExtrasRutas();
exports.default = HORA_EXTRA_RUTA.router;
