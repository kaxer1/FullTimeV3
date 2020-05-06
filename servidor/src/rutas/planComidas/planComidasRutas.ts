import { Router } from 'express';

import PLAN_COMIDAS_CONTROLADOR from '../../controlador/planComidas/planComidasControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PLAN_COMIDAS_CONTROLADOR.ListarPlanComidas);
        this.router.get('/infoComida/:id_empleado', PLAN_COMIDAS_CONTROLADOR.EncontrarPlanComidaPorIdEmpleado);
        this.router.post('/', PLAN_COMIDAS_CONTROLADOR.CrearPlanComidas);

    }
}

const PLAN_COMIDAS_RUTAS = new DepartamentoRutas();

export default PLAN_COMIDAS_RUTAS.router;