import { Router } from 'express';

import notificacionesControlador from '../../controlador/Catalogos/notificacionesControlador';

class NotificacionesRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', notificacionesControlador.list);
        this.router.get('/:id', notificacionesControlador.getOne);
        this.router.post('/', notificacionesControlador.create);
    }
}

const notificacionesRutas = new NotificacionesRutas();

export default notificacionesRutas.router;