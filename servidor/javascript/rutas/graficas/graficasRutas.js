"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const graficasControlador_1 = __importDefault(require("../../controlador/graficas/graficasControlador"));
class GraficasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/admin/hora-extra/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminHorasExtrasMicro);
        this.router.get('/admin/hora-extra/macro/:desde/:hasta', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminHorasExtrasMacro);
        this.router.get('/admin/retrasos/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminRetrasosMicro);
        this.router.get('/admin/retrasos/macro/:desde/:hasta', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminRetrasosMacro);
        this.router.get('/admin/asistencia/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminAsistenciaMicro);
        this.router.get('/admin/asistencia/macro/:desde/:hasta', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminAsistenciaMacro);
        this.router.get('/admin/jornada-vs-hora-extra/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminJornadaHorasExtrasMicro);
        this.router.get('/admin/jornada-vs-hora-extra/macro/:desde/:hasta', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminJornadaHorasExtrasMacro);
        this.router.get('/admin/tiempo-jornada-vs-hora-ext/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminTiempoJornadaHorasExtrasMicro);
        this.router.get('/admin/tiempo-jornada-vs-hora-ext/macro/:desde/:hasta', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminTiempoJornadaHorasExtrasMacro);
        this.router.get('/admin/inasistencia/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminInasistenciaMicro);
        this.router.get('/admin/inasistencia/macro/:desde/:hasta', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminInasistenciaMacro);
        this.router.get('/admin/marcaciones-emp/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminMarcacionesEmpleadoMicro);
        this.router.get('/admin/marcaciones-emp/macro/:desde/:hasta', verificarToken_1.TokenValidation, graficasControlador_1.default.AdminMarcacionesEmpleadoMacro);
        //empleado
        this.router.get('/user/hora-extra/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.EmpleadoHorasExtrasMicro);
        this.router.get('/user/vacaciones/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.EmpleadoVacacionesMicro);
        this.router.get('/user/permisos/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.EmpleadoPermisosMicro);
        this.router.get('/user/atrasos/micro', verificarToken_1.TokenValidation, graficasControlador_1.default.EmpleadoAtrasosMicro);
    }
}
const GRAFICAS_RUTAS = new GraficasRutas();
exports.default = GRAFICAS_RUTAS.router;
