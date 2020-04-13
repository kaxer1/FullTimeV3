import { Router } from 'express';
import NOTIFICACIONES_CONTROLADOR from '../../controlador/Catalogos/catNotificacionesControlador';

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

const notificacionesRutas = new NotificacionesRutas();

export default notificacionesRutas.router;
