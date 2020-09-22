import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import PLAN_HORA_EXTRA_CONTROLADOR from '../../controlador/planHoraExtra/planHoraExtraControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.ListarPlanHoraExtra);
        this.router.post('/', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.CrearPlanHoraExtra);
        this.router.put('/tiempo-autorizado/:id', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.TiempoAutorizado);

    }
}

const PLAN_HORA_EXTRA_RUTAS = new DepartamentoRutas();

export default PLAN_HORA_EXTRA_RUTAS.router;