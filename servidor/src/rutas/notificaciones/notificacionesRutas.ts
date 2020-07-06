import { Router } from 'express';
import NOTIFICACION_TIEMPO_REAL_CONTROLADOR from '../../controlador/notificaciones/notificacionesControlador';


class NotificacionTiempoRealRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ListarNotificacion);
        this.router.get('/one/:id', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ObtenerUnaNotificacion);
        this.router.get('/send/:id_send', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ListaPorEmpleado);
        this.router.get('/receives/:id_receive', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ListaPorJefe);
        this.router.post('/', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.create);
        this.router.post('/vista/:id', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ActualizarVista);
    }
}

const NOTIFICACION_TIEMPO_REAL_RUTAS = new NotificacionTiempoRealRutas();

export default NOTIFICACION_TIEMPO_REAL_RUTAS.router;