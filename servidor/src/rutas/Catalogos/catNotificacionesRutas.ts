import { Router } from 'express';
import NOTIFICACIONES_CONTROLADOR from '../../controlador/catalogos/catNotificacionesControlador';

class NotificacionesRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', NOTIFICACIONES_CONTROLADOR.ListarNotificaciones);
        this.router.get('/:id', NOTIFICACIONES_CONTROLADOR.ObtenerUnaNotificacion);
        this.router.post('/', NOTIFICACIONES_CONTROLADOR.CrearNotificacion);
    }
}

const NOTIFICACIONES_RUTAS = new NotificacionesRutas();

export default NOTIFICACIONES_RUTAS.router;
