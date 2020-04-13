import { Router } from 'express';

import ENROLADOS_CONTROLADOR from '../../controlador/Catalogos/catEnroladoControlador';

class EnroladoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', ENROLADOS_CONTROLADOR.ListarEnrolados);
        this.router.get('/:id',  ENROLADOS_CONTROLADOR.ObtenerUnEnrolado);
        this.router.post('/', ENROLADOS_CONTROLADOR.CrearEnrolado);
        this.router.get('/busqueda/:nombre', ENROLADOS_CONTROLADOR.ObtenerIdEnroladoNombre)
    }
}

const ENROLADO_RUTAS = new EnroladoRutas();

export default ENROLADO_RUTAS.router;