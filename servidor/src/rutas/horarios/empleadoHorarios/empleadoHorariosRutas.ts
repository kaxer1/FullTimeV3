import { Router } from 'express';
import EMPLEADO_HORARIOS_CONTROLADOR from '../../../controlador/horarios/empleadoHorarios/empleadoHorariosControlador';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});

class EmpleadoHorariosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', EMPLEADO_HORARIOS_CONTROLADOR.ListarEmpleadoHorarios);
        this.router.post('/', EMPLEADO_HORARIOS_CONTROLADOR.CrearEmpleadoHorarios);
        this.router.get('/horarioCargo/:id_empl_cargo', EMPLEADO_HORARIOS_CONTROLADOR.ListarHorarioCargo);
        this.router.post('/upload/:id', multipartMiddleware, EMPLEADO_HORARIOS_CONTROLADOR.CrearHorarioEmpleadoPlantilla);
    }
}

const EMPLEADO_HORARIOS_RUTAS = new EmpleadoHorariosRutas();

export default EMPLEADO_HORARIOS_RUTAS.router;