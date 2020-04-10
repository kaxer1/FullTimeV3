import { Router } from 'express';

import ENROLADO_RELOJ_CONTROLADOR  from '../../controlador/enroladoReloj/enroladoRelojControlador';

class CiudadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.post('/insertar', ENROLADO_RELOJ_CONTROLADOR.AsignarRelojEnrolado);
        this.router.post('/buscar', ENROLADO_RELOJ_CONTROLADOR.ObtenerIdReloj);
        this.router.get('/nombresReloj/:enroladoid', ENROLADO_RELOJ_CONTROLADOR.EncontrarEnroladosReloj);
    }
}

const ENROLADO_RELOJ_RUTAS = new CiudadRutas();

export default ENROLADO_RELOJ_RUTAS.router;