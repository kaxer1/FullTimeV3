import { Router } from 'express';

import PERIODO_VACACION_CONTROLADOR from '../../../controlador/empleado/empleadoPeriodoVacacion/periodoVacacionControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PERIODO_VACACION_CONTROLADOR.ListarPerVacaciones);
        this.router.post('/', PERIODO_VACACION_CONTROLADOR.CrearPerVacaciones);
    }
}

const PERIODO_VACACION__RUTAS = new DepartamentoRutas();

export default PERIODO_VACACION__RUTAS.router;