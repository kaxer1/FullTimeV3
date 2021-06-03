import { Router } from 'express';

import NOTIFICACIONES_CONTROLADOR from '../../controlador/reportes/reporteNotificacionControlador';

class NotificacionesRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/permisos_enviados/:envia', NOTIFICACIONES_CONTROLADOR.ListarPermisosEnviados);
        this.router.get('/permisos_recibidos/:recibe', NOTIFICACIONES_CONTROLADOR.ListarPermisosRecibidos);
        this.router.get('/solicita_extra_enviados/:envia', NOTIFICACIONES_CONTROLADOR.ListarSolicitudHoraExtraEnviadas);
        this.router.get('/solicita_extra_recibidos/:recibe', NOTIFICACIONES_CONTROLADOR.ListarSolicitudHoraExtraRecibidas);
        this.router.get('/vacaciones_enviados/:envia', NOTIFICACIONES_CONTROLADOR.ListarVacacionesEnviadas);
        this.router.get('/vacaciones_recibidos/:recibe', NOTIFICACIONES_CONTROLADOR.ListarVacacionesRecibidas);
        this.router.get('/planificaciones_enviadas/:envia', NOTIFICACIONES_CONTROLADOR.ListarPlanificaComidaEnviadas);
        this.router.get('/planificaciones_eliminadas/:envia', NOTIFICACIONES_CONTROLADOR.ListarPlanificacionesEliminadas);
    
    }
}

const NOTIFICACION_RUTAS = new NotificacionesRutas();

export default NOTIFICACION_RUTAS.router;