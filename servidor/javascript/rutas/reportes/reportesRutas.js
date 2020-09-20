"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportesControlador_1 = __importDefault(require("../../controlador/reportes/reportesControlador"));
class CiudadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/horasExtrasReales', reportesControlador_1.default.ListarDatosContractoA);
        this.router.get('/horasExtrasReales/:empleado_id', reportesControlador_1.default.ListarDatosCargoA);
        this.router.post('/horasExtrasReales/entradaSalida/:id_empleado', reportesControlador_1.default.ListarEntradaSalidaEmpleado);
        this.router.post('/horasExtrasReales/listaPedidos/:id_usua_solicita', reportesControlador_1.default.ListarPedidosEmpleado);
        this.router.post('/horasExtrasReales/entradaSalida/total/timbres', reportesControlador_1.default.ListarEntradaSalidaTodos);
        this.router.post('/horasExtrasReales/listaPedidos/total/solicitudes', reportesControlador_1.default.ListarPedidosTodos);
        this.router.post('/reporteTimbres/listaTimbres/:id_empleado', reportesControlador_1.default.ListarTimbres);
        this.router.get('/reportePermisos/horarios/:id_empleado', reportesControlador_1.default.ListarPermisoHorarioEmpleado);
        this.router.get('/reportePermisos/planificacion/:id_empleado', reportesControlador_1.default.ListarPermisoPlanificaEmpleado);
        this.router.get('/reportePermisos/autorizaciones/:id_empleado', reportesControlador_1.default.ListarPermisoAutorizaEmpleado);
        this.router.post('/reporteAtrasos/horarios/:id_empleado', reportesControlador_1.default.ListarAtrasosHorarioEmpleado);
        this.router.post('/reporteAtrasos/planificacion/:id_empleado', reportesControlador_1.default.ListarAtrasosPlanificaEmpleado);
        this.router.post('/reporteEntradaSalida/horarios/:id_empleado', reportesControlador_1.default.ListarEntradaSalidaHorarioEmpleado);
        this.router.post('/reporteEntradaSalida/planificacion/:id_empleado', reportesControlador_1.default.ListarEntradaSalidaPlanificaEmpleado);
        this.router.post('/reportePermisos/fechas/horarios/:id_empleado', reportesControlador_1.default.ListarPermisoHorarioEmpleadoFechas);
        this.router.post('/reportePermisos/fechas/planificacion/:id_empleado', reportesControlador_1.default.ListarPermisoPlanificaEmpleadoFechas);
    }
}
const REPORTES_RUTAS = new CiudadRutas();
exports.default = REPORTES_RUTAS.router;
