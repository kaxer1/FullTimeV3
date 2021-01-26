import { Router } from 'express';

import ALIMENTACION_CONTROLADOR from '../../controlador/reportes/alimentacionControlador';

class CiudadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.post('/planificados', ALIMENTACION_CONTROLADOR.ListarPlanificadosConsumidos);
        this.router.post('/solicitados', ALIMENTACION_CONTROLADOR.ListarSolicitadosConsumidos);
        this.router.post('/extras', ALIMENTACION_CONTROLADOR.ListarExtrasConsumidos);
    }
}

const ALIMENTACION_RUTAS = new CiudadRutas();

export default ALIMENTACION_RUTAS.router;