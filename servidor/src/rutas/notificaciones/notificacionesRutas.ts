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
        this.router.get('/all-receives/:id_receive', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ListaNotificacionesRecibidas);
        this.router.get('/receives/:id_receive', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ListaPorJefe);
        this.router.post('/', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.create);
        this.router.put('/vista/:id', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ActualizarVista);
        // RUTAS CONFIG_NOTI
        this.router.get('/config/:id', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ObtenerConfigEmpleado);
        this.router.post('/config/', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.CrearConfiguracion);
        this.router.put('/config/noti-put/:id', NOTIFICACION_TIEMPO_REAL_CONTROLADOR.ActualizarConfigEmpleado);

    }
}

const NOTIFICACION_TIEMPO_REAL_RUTAS = new NotificacionTiempoRealRutas();

export default NOTIFICACION_TIEMPO_REAL_RUTAS.router;