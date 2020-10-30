import { Router } from 'express';
import DATOS_GENERALES_CONTROLADOR from '../../controlador/datosGenerales/datosGeneralesControlador';
import { TokenValidation } from '../../libs/verificarToken'

class CiudadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/empleadoAutoriza/:empleado_id', TokenValidation, DATOS_GENERALES_CONTROLADOR.ListarDatosEmpleadoAutoriza);
        this.router.get('/info_actual', TokenValidation, DATOS_GENERALES_CONTROLADOR.ListarDatosActualesEmpleado);
    }
}

const DATOS_GENERALES_RUTAS = new CiudadRutas();

export default DATOS_GENERALES_RUTAS.router;