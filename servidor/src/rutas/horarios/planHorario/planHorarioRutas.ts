import { Router } from 'express';
import PLAN_HORARIO_CONTROLADOR from '../../../controlador/horarios/planHorario/planHorarioControlador';
import { TokenValidation } from '../../../libs/VerificarToken'

class PlanHorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, PLAN_HORARIO_CONTROLADOR.ListarPlanHorario);
        this.router.post('/', TokenValidation, PLAN_HORARIO_CONTROLADOR.CrearPlanHorario);
        this.router.get('/buscar/:id_empleado', TokenValidation, PLAN_HORARIO_CONTROLADOR.EncontrarIdPlanHorario);
        this.router.get('/infoPlan/:id_cargo', TokenValidation, PLAN_HORARIO_CONTROLADOR.EncontrarPlanHorarioPorIdCargo);
        this.router.get('/datosPlanHorario/:id', TokenValidation, PLAN_HORARIO_CONTROLADOR.EncontrarPlanHorarioPorId);
        this.router.put('/', TokenValidation, PLAN_HORARIO_CONTROLADOR.ActualizarPlanHorario);
        this.router.delete('/eliminar/:id', TokenValidation, PLAN_HORARIO_CONTROLADOR.EliminarRegistros);
    }
}

const PLAN_HORARIO_RUTAS = new PlanHorarioRutas();

export default PLAN_HORARIO_RUTAS.router;