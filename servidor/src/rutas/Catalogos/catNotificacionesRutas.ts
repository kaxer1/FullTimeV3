import { Router } from 'express';
import NOTIFICACIONES_CONTROLADOR from '../../controlador/catalogos/catNotificacionesControlador';

class NotificacionesRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', NOTIFICACIONES_CONTROLADOR.ListarNotificaciones);
        this.router.get('/depa/:id_depa', NOTIFICACIONES_CONTROLADOR.ListarNotiByDepartamento);
        this.router.get('/:id', NOTIFICACIONES_CONTROLADOR.ObtenerUnaNotificacion);
        this.router.get('/listar/final', NOTIFICACIONES_CONTROLADOR.NotificacionLista);
        this.router.post('/', NOTIFICACIONES_CONTROLADOR.CrearNotificacion);
        this.router.get('/notificacionPermiso/:id_tipo_permiso', NOTIFICACIONES_CONTROLADOR.ObtenerNotificacionPermiso);
    }
}

const NOTIFICACIONES_RUTAS = new NotificacionesRutas();

export default NOTIFICACIONES_RUTAS.router;
