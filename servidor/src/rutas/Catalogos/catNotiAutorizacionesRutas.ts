import { Router } from 'express';
import NOTIFICACIONES_AUTORIZACIONES_CONTROLADOR from '../../controlador/catalogos/catNotiAutorizacionesControlador';

class NotificacionesAutorizacionesRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', NOTIFICACIONES_AUTORIZACIONES_CONTROLADOR.ListarNotiAutorizaciones);
        this.router.get('/lista/:id_notificacion', NOTIFICACIONES_AUTORIZACIONES_CONTROLADOR.ListarPorNotificacion);
        this.router.get('/:id', NOTIFICACIONES_AUTORIZACIONES_CONTROLADOR.ObtenerUnaNotiAutorizacion);
        this.router.post('/', NOTIFICACIONES_AUTORIZACIONES_CONTROLADOR.CrearNotiAutorizacion);
    }
}

const NOTIFICACIONES_AUTORIZACIONES_RUTA = new NotificacionesAutorizacionesRutas();

export default NOTIFICACIONES_AUTORIZACIONES_RUTA.router;