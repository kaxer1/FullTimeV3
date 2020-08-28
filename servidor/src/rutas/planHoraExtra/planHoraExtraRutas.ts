import { Router } from 'express';
import PLAN_HORA_EXTRA_CONTROLADOR from '../../controlador/planHoraExtra/planHoraExtraControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.post('/', PLAN_HORA_EXTRA_CONTROLADOR.CrearPlanHoraExtra);
    }
}

const PLAN_HORA_EXTRA_RUTAS = new DepartamentoRutas();

export default PLAN_HORA_EXTRA_RUTAS.router;