import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import TIMBRES_CONTROLADOR from '../../controlador/timbres/timbresControlador';

class TimbresRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/noti-timbres/:id_empleado', TokenValidation, TIMBRES_CONTROLADOR.ObtenerRealTimeTimbresEmpleado);
        this.router.put('/noti-timbres/vista/:id_noti_timbre', TokenValidation, TIMBRES_CONTROLADOR.ActualizarVista);
        // this.router.post('/mail-noti/', TokenValidation, TIMBRES_CONTROLADOR.SendMailNotifiPermiso);
        // this.router.put('/:id/estado', TokenValidation, TIMBRES_CONTROLADOR.ActualizarEstado);
        // this.router.delete('/eliminar/:id_vacacion', TokenValidation, TIMBRES_CONTROLADOR.EliminarVacaciones);
    }
}

const TIMBRES_RUTAS = new TimbresRutas();

export default TIMBRES_RUTAS.router;