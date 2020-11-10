import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import PLAN_GENERAL_CONTROLADOR from '../../controlador/planGeneral/planGeneralControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.post('/', TokenValidation, PLAN_GENERAL_CONTROLADOR.CrearPlanificacion);
        this.router.delete('/eliminar/:codigo', TokenValidation, PLAN_GENERAL_CONTROLADOR.EliminarRegistros);
    }
}

const PLAN_GENERAL_RUTAS = new DepartamentoRutas();

export default PLAN_GENERAL_RUTAS.router;