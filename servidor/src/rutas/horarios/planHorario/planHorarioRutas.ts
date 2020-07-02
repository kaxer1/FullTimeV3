import { Router } from 'express';

import PLAN_HORARIO_CONTROLADOR from '../../../controlador/horarios/planHorario/planHorarioControlador';

class PlanHorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PLAN_HORARIO_CONTROLADOR.ListarPlanHorario);
        this.router.post('/', PLAN_HORARIO_CONTROLADOR.CrearPlanHorario);
        this.router.get('/buscar/:id_empleado', PLAN_HORARIO_CONTROLADOR.EncontrarIdPlanHorario);
        this.router.get('/infoPlan/:id_cargo', PLAN_HORARIO_CONTROLADOR.EncontrarPlanHorarioPorIdCargo);
        this.router.get('/datosPlanHorario/:id', PLAN_HORARIO_CONTROLADOR.EncontrarPlanHorarioPorId);
    }
}

const PLAN_HORARIO_RUTAS = new PlanHorarioRutas();

export default PLAN_HORARIO_RUTAS.router;