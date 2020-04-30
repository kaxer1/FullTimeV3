import { Router } from 'express';

import DETALLE_PLAN_HORARIO_CONTROLADOR from '../../../controlador/horarios/detallePlanHorario/detallePlanHorarioControlador';

class DetallePlanHorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DETALLE_PLAN_HORARIO_CONTROLADOR.ListarDetallePlanHorario);
        this.router.post('/', DETALLE_PLAN_HORARIO_CONTROLADOR.CrearDetallePlanHorario);
    }
}

const DETALLE_PLAN_HORARIO_RUTAS = new DetallePlanHorarioRutas();

export default DETALLE_PLAN_HORARIO_RUTAS.router;