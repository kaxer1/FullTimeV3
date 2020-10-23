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
        this.router.get('/justificar', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.ListarPlanHoraExtraObserva);
        this.router.get('/autorizacion', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.ListarPlanHoraExtraAutorizada);
        this.router.post('/', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.CrearPlanHoraExtra);
        this.router.put('/tiempo-autorizado/:id', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.TiempoAutorizado);
        this.router.put('/observacion/:id', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.ActualizarObservacion);
        this.router.put('/estado/:id', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.ActualizarEstado);
        this.router.post('/send/aviso/', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.EnviarCorreoNotificacion);
        this.router.post('/send/planifica/', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.EnviarCorreoPlanificacion);
        this.router.get('/datosAutorizacion/:id_plan_extra', TokenValidation, PLAN_HORA_EXTRA_CONTROLADOR.ObtenerDatosAutorizacion);
    }
}

const PLAN_HORA_EXTRA_RUTAS = new DepartamentoRutas();

export default PLAN_HORA_EXTRA_RUTAS.router;