import { Router } from 'express';
import NOTIFICACIONES_CONTROLADOR from '../../controlador/Catalogos/notificacionesControlador';

class NotificacionesRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', NOTIFICACIONES_CONTROLADOR.list);
        this.router.get('/:id', NOTIFICACIONES_CONTROLADOR.getOne);
        this.router.post('/', NOTIFICACIONES_CONTROLADOR.create);
    }
}

const notificacionesRutas = new NotificacionesRutas();

export default notificacionesRutas.router;
