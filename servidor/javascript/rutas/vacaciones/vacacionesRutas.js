"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vacacionesControlador_1 = __importDefault(require("../../controlador/vacaciones/vacacionesControlador"));
class VacacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', vacacionesControlador_1.default.ListarVacaciones);
        this.router.get('/:id', vacacionesControlador_1.default.VacacionesIdPeriodo);
        this.router.get('/one/:id', vacacionesControlador_1.default.ListarUnaVacacion);
        this.router.post('/', vacacionesControlador_1.default.CrearVacaciones);
        this.router.post('/fechasFeriado', vacacionesControlador_1.default.ObtenerFechasFeriado);
        this.router.post('/mail-noti/', vacacionesControlador_1.default.SendMailNotifiPermiso);
        this.router.put('/:id/estado', vacacionesControlador_1.default.ActualizarEstado);
        this.router.put('/:id/vacacion-solicitada', vacacionesControlador_1.default.EditarVacaciones);
        this.router.get('/datosSolicitud/:id_emple_vacacion', vacacionesControlador_1.default.ObtenerSolicitudVacaciones);
        this.router.get('/datosAutorizacion/:id_vacaciones/:id_empleado', vacacionesControlador_1.default.ObtenerAutorizacionVacaciones);
        this.router.delete('/eliminar/:id_vacacion', vacacionesControlador_1.default.EliminarVacaciones);
    }
}
const VACACIONES_RUTAS = new VacacionesRutas();
exports.default = VACACIONES_RUTAS.router;
