import { Router } from 'express';

import ENROLADOS_CONTROLADOR from '../../controlador/Catalogos/enroladoControlador';

class EnroladoRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', ENROLADOS_CONTROLADOR.list);
        this.router.get('/:id',  ENROLADOS_CONTROLADOR.getOne);
        this.router.post('/', ENROLADOS_CONTROLADOR.create);
        this.router.get('/busqueda/:nombre', ENROLADOS_CONTROLADOR.getIdByNombre)
    }
}

const ENROLADO_RUTAS = new EnroladoRutas();

export default ENROLADO_RUTAS.router;