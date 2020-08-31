import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import PLAN_COMIDAS_CONTROLADOR from '../../controlador/planComidas/planComidasControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, PLAN_COMIDAS_CONTROLADOR.ListarPlanComidas);
        this.router.get('/infoComida/:id_empleado', TokenValidation, PLAN_COMIDAS_CONTROLADOR.EncontrarPlanComidaPorIdEmpleado);
        this.router.post('/', TokenValidation, PLAN_COMIDAS_CONTROLADOR.CrearPlanComidas);
        this.router.delete('/eliminar/:id', TokenValidation, PLAN_COMIDAS_CONTROLADOR.EliminarRegistros);
        this.router.put('/', TokenValidation, PLAN_COMIDAS_CONTROLADOR.ActualizarPlanComidas);

    }
}

const PLAN_COMIDAS_RUTAS = new DepartamentoRutas();

export default PLAN_COMIDAS_RUTAS.router;