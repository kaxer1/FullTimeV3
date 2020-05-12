import { Router } from 'express';
import AUTORIZACIONES_CONTROLADOR from '../../controlador/autorizaciones/autorizacionesControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', AUTORIZACIONES_CONTROLADOR.ListarAutorizaciones);
        this.router.get('/:id', AUTORIZACIONES_CONTROLADOR.ListarUnaAutorizacion);
        this.router.post('/', AUTORIZACIONES_CONTROLADOR.CrearAutorizacion);
    }
}

const AUTORIZA_DEPARTAMENTO_RUTAS = new DepartamentoRutas();

export default AUTORIZA_DEPARTAMENTO_RUTAS.router;