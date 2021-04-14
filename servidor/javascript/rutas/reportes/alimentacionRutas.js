"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alimentacionControlador_1 = __importDefault(require("../../controlador/reportes/alimentacionControlador"));
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.post('/planificados', alimentacionControlador_1.default.ListarPlanificadosConsumidos);
        this.router.post('/solicitados', alimentacionControlador_1.default.ListarSolicitadosConsumidos);
        this.router.post('/extras/plan', alimentacionControlador_1.default.ListarExtrasPlanConsumidos);
        this.router.post('/extras/solicita', alimentacionControlador_1.default.ListarExtrasSolConsumidos);
        // Detalle de servicio de alimentación
        this.router.post('/planificados/detalle', alimentacionControlador_1.default.DetallarPlanificadosConsumidos);
        this.router.post('/solicitados/detalle', alimentacionControlador_1.default.DetallarSolicitudConsumidos);
        this.router.post('/extras/detalle/plan', alimentacionControlador_1.default.DetallarExtrasPlanConsumidos);
        this.router.post('/extras/detalle/solicita', alimentacionControlador_1.default.DetallarExtrasSolConsumidos);
    }
}
const ALIMENTACION_RUTAS = new CiudadRutas();
exports.default = ALIMENTACION_RUTAS.router;
