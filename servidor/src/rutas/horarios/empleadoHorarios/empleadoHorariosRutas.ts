import { Router } from 'express';
import EMPLEADO_HORARIOS_CONTROLADOR from '../../../controlador/horarios/empleadoHorarios/empleadoHorariosControlador';

class EmpleadoHorariosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', EMPLEADO_HORARIOS_CONTROLADOR.ListarEmpleadoHorarios);
        this.router.post('/', EMPLEADO_HORARIOS_CONTROLADOR.CrearEmpleadoHorarios);
    }
}

const EMPLEADO_HORARIOS_RUTAS = new EmpleadoHorariosRutas();

export default EMPLEADO_HORARIOS_RUTAS.router;