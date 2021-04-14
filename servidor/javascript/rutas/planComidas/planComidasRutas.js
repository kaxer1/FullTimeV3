"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const planComidasControlador_1 = __importDefault(require("../../controlador/planComidas/planComidasControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        /** SOLICITUD DE ALIMENTACIÓN */
        this.router.post('/solicitud', verificarToken_1.TokenValidation, planComidasControlador_1.default.CrearSolicitaComida);
        this.router.put('/solicitud', verificarToken_1.TokenValidation, planComidasControlador_1.default.ActualizarSolicitaComida);
        this.router.get('/infoComida/:id_empleado', verificarToken_1.TokenValidation, planComidasControlador_1.default.EncontrarSolicitaComidaIdEmpleado);
        /** CONOCER JEFES DE UN DEPARTAMENTO */
        this.router.get('/enviar/notificacion/:id_departamento', verificarToken_1.TokenValidation, planComidasControlador_1.default.BuscarJefes);
        this.router.post('/mail-noti/', verificarToken_1.TokenValidation, planComidasControlador_1.default.EnviarCorreoComidas);
        /** PLANIFICACIÓN DE ALIMENTACIÓN */
        this.router.get('/', verificarToken_1.TokenValidation, planComidasControlador_1.default.ListarPlanComidas);
        this.router.post('/', verificarToken_1.TokenValidation, planComidasControlador_1.default.CrearPlanComidas);
        this.router.get('/fin_registro', verificarToken_1.TokenValidation, planComidasControlador_1.default.ObtenerUltimaPlanificacion);
        this.router.get('/infoComida/plan/:id_empleado', verificarToken_1.TokenValidation, planComidasControlador_1.default.EncontrarPlanComidaIdEmpleado);
        this.router.delete('/eliminar/:id', verificarToken_1.TokenValidation, planComidasControlador_1.default.EliminarRegistros);
        this.router.put('/', verificarToken_1.TokenValidation, planComidasControlador_1.default.ActualizarPlanComidas);
        /** REGISTRO DE LA PLANIFICACIÓN DE ALIMENTACIÓN AL EMPLEADO */
        this.router.post('/empleado/plan', verificarToken_1.TokenValidation, planComidasControlador_1.default.CrearPlanEmpleado);
        this.router.post('/mail-plan/', verificarToken_1.TokenValidation, planComidasControlador_1.default.EnviarCorreoPlanComidas);
        // Registrar en tabla tipo_comida
        this.router.post('/tipo_comida', verificarToken_1.TokenValidation, planComidasControlador_1.default.CrearTipoComidas);
        this.router.get('/tipo_comida', verificarToken_1.TokenValidation, planComidasControlador_1.default.ListarTipoComidas);
        this.router.get('/tipo_comida/ultimo', verificarToken_1.TokenValidation, planComidasControlador_1.default.VerUltimoTipoComidas);
        this.router.post('/send/planifica/', verificarToken_1.TokenValidation, planComidasControlador_1.default.EnviarNotificacionPlanComida);
    }
}
const PLAN_COMIDAS_RUTAS = new DepartamentoRutas();
exports.default = PLAN_COMIDAS_RUTAS.router;
