import { Router } from 'express';

import DETALLE_PLAN_HORARIO_CONTROLADOR from '../../../controlador/horarios/detallePlanHorario/detallePlanHorarioControlador';

const multipart = require('connect-multiparty');  

const multipartMiddleware = multipart({  
    uploadDir: './plantillas',
});

class DetallePlanHorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DETALLE_PLAN_HORARIO_CONTROLADOR.ListarDetallePlanHorario);
        this.router.get('/infoPlan/:id_plan_horario', DETALLE_PLAN_HORARIO_CONTROLADOR.EncontrarPlanHoraDetallesPorIdPlanHorario);
        this.router.post('/', DETALLE_PLAN_HORARIO_CONTROLADOR.CrearDetallePlanHorario);
        this.router.post('/:id_plan_horario/upload', multipartMiddleware, DETALLE_PLAN_HORARIO_CONTROLADOR.CrearDetallePlanificacionPlantilla);
    }
}

const DETALLE_PLAN_HORARIO_RUTAS = new DetallePlanHorarioRutas();

export default DETALLE_PLAN_HORARIO_RUTAS.router;