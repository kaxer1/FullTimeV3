"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerificarToken_1 = require("../../libs/VerificarToken");
const enroladoRelojControlador_1 = __importDefault(require("../../controlador/enroladoReloj/enroladoRelojControlador"));
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.post('/insertar', VerificarToken_1.TokenValidation, enroladoRelojControlador_1.default.AsignarRelojEnrolado);
        this.router.post('/buscar', VerificarToken_1.TokenValidation, enroladoRelojControlador_1.default.ObtenerIdReloj);
        this.router.get('/nombresReloj/:enroladoid', VerificarToken_1.TokenValidation, enroladoRelojControlador_1.default.EncontrarEnroladosReloj);
        this.router.put('/', VerificarToken_1.TokenValidation, enroladoRelojControlador_1.default.ActualizarRelojEnrolado);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, enroladoRelojControlador_1.default.EliminarRelojEnrolado);
    }
}
const ENROLADO_RELOJ_RUTAS = new CiudadRutas();
exports.default = ENROLADO_RELOJ_RUTAS.router;
