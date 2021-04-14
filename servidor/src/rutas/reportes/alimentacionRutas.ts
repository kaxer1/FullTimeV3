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
        this.router.post('/extras/plan', ALIMENTACION_CONTROLADOR.ListarExtrasPlanConsumidos);
        this.router.post('/extras/solicita', ALIMENTACION_CONTROLADOR.ListarExtrasSolConsumidos);

        // Detalle de servicio de alimentación
        this.router.post('/planificados/detalle', ALIMENTACION_CONTROLADOR.DetallarPlanificadosConsumidos);
        this.router.post('/solicitados/detalle', ALIMENTACION_CONTROLADOR.DetallarSolicitudConsumidos);
        this.router.post('/extras/detalle/plan', ALIMENTACION_CONTROLADOR.DetallarExtrasPlanConsumidos);
        this.router.post('/extras/detalle/solicita', ALIMENTACION_CONTROLADOR.DetallarExtrasSolConsumidos);
    }
}

const ALIMENTACION_RUTAS = new CiudadRutas();

export default ALIMENTACION_RUTAS.router;