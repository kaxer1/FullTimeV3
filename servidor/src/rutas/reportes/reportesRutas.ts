import { Router } from 'express';

import REPORTES_CONTROLADOR from '../../controlador/reportes/reportesControlador';

class CiudadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/horasExtrasReales', REPORTES_CONTROLADOR.ListarDatosContractoA);
        this.router.get('/horasExtrasReales/:empleado_id', REPORTES_CONTROLADOR.ListarDatosCargoA);
        this.router.post('/horasExtrasReales/entradaSalida/:id_empleado', REPORTES_CONTROLADOR.ListarEntradaSalidaEmpleado);
        this.router.post('/horasExtrasReales/listaPedidos/:id_usua_solicita', REPORTES_CONTROLADOR.ListarPedidosEmpleado);
        this.router.post('/horasExtrasReales/entradaSalida/total/timbres', REPORTES_CONTROLADOR.ListarEntradaSalidaTodos);
        this.router.post('/horasExtrasReales/listaPedidos/total/solicitudes', REPORTES_CONTROLADOR.ListarPedidosTodos);
        this.router.post('/reporteTimbres/listaTimbres/:id_empleado', REPORTES_CONTROLADOR.ListarTimbres);
        this.router.get('/reportePermisos/horarios/:id_empleado', REPORTES_CONTROLADOR.ListarPermisoHorarioEmpleado);
        this.router.get('/reportePermisos/planificacion/:id_empleado', REPORTES_CONTROLADOR.ListarPermisoPlanificaEmpleado);
        this.router.get('/reportePermisos/autorizaciones/:id_empleado', REPORTES_CONTROLADOR.ListarPermisoAutorizaEmpleado);
        this.router.post('/reporteAtrasos/horarios/:id_empleado', REPORTES_CONTROLADOR.ListarAtrasosHorarioEmpleado);
        this.router.post('/reporteAtrasos/planificacion/:id_empleado', REPORTES_CONTROLADOR.ListarAtrasosPlanificaEmpleado);
        this.router.post('/reporteEntradaSalida/horarios/:id_empleado', REPORTES_CONTROLADOR.ListarEntradaSalidaHorarioEmpleado);
        this.router.post('/reporteEntradaSalida/planificacion/:id_empleado', REPORTES_CONTROLADOR.ListarEntradaSalidaPlanificaEmpleado);
    }
}

const REPORTES_RUTAS = new CiudadRutas();

export default REPORTES_RUTAS.router;