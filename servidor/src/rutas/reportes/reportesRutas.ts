import { Router } from 'express';

import REPORTES_CONTROLADOR from '../../controlador/reportes/reportesControlador';

class CiudadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/horasExtrasReales', REPORTES_CONTROLADOR.ListarDatosContractoA);
        this.router.get('/horasExtrasReales/:empleado_id', REPORTES_CONTROLADOR.ListarDatosCargoA);
    }
}

const REPORTES_RUTAS = new CiudadRutas();

export default REPORTES_RUTAS.router;