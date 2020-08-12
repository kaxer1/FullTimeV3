import { Router } from 'express';

import EMPLEADO_PROCESO_CONTROLADOR from '../../../controlador/empleado/empleadoProcesos/empleProcesoControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', EMPLEADO_PROCESO_CONTROLADOR.ListarEmpleProcesos);
        this.router.get('/infoProceso/:id_empl_cargo', EMPLEADO_PROCESO_CONTROLADOR.EncontrarProcesoPorIdCargo);
        this.router.post('/', EMPLEADO_PROCESO_CONTROLADOR.CrearEmpleProcesos);
        this.router.put('/', EMPLEADO_PROCESO_CONTROLADOR.ActualizarProcesoEmpleado);
        this.router.delete('/eliminar/:id', EMPLEADO_PROCESO_CONTROLADOR.EliminarRegistros);
    }
}

const EMPLEADO_PROCESO_RUTAS = new DepartamentoRutas();

export default EMPLEADO_PROCESO_RUTAS.router;