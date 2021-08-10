"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alimentacionControlador_1 = __importDefault(require("../../controlador/reportes/alimentacionControlador"));
const verificarAlimentacion_1 = require("../../libs/Modulos/verificarAlimentacion");
const verificarToken_1 = require("../../libs/verificarToken");
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.post('/planificados', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.ListarPlanificadosConsumidos);
        this.router.post('/solicitados', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.ListarSolicitadosConsumidos);
        this.router.post('/extras/plan', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.ListarExtrasPlanConsumidos);
        this.router.post('/extras/solicita', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.ListarExtrasSolConsumidos);
        // Detalle de servicio de alimentación
        this.router.post('/planificados/detalle', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.DetallarPlanificadosConsumidos);
        this.router.post('/solicitados/detalle', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.DetallarSolicitudConsumidos);
        this.router.post('/extras/detalle/plan', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.DetallarExtrasPlanConsumidos);
        this.router.post('/extras/detalle/solicita', [verificarToken_1.TokenValidation, verificarAlimentacion_1.ModuloAlimentacionValidation], alimentacionControlador_1.default.DetallarExtrasSolConsumidos);
    }
}
const ALIMENTACION_RUTAS = new CiudadRutas();
exports.default = ALIMENTACION_RUTAS.router;
