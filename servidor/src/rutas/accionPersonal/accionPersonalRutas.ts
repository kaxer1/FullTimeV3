import { Router } from 'express';
import ACCION_PERSONAL_CONTROLADOR from '../../controlador/accionPersonal/accionPersonalControlador';
import { TokenValidation } from '../../libs/verificarToken'

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ListarTipoAccionPersonal);
        this.router.post('/', TokenValidation, ACCION_PERSONAL_CONTROLADOR.CrearTipoAccionPersonal);
        this.router.get('/tipo/accion/:id', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarTipoAccionPersonalId);
        this.router.put('/', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ActualizarTipoAccionPersonal);
        this.router.delete('/eliminar/:id', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EliminarTipoAccionPersonal);
    }
}

const ACCION_PERSONAL_RUTAS = new DepartamentoRutas();

export default ACCION_PERSONAL_RUTAS.router;