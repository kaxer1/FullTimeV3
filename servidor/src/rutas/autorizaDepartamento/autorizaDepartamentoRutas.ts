import { Router } from 'express';
import AUTORIZA_DEPARTAMENTO_CONTROLADOR from '../../controlador/autorizaDepartamento/autorizaDepartamentoControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', AUTORIZA_DEPARTAMENTO_CONTROLADOR.ListarAutorizaDepartamento);
        this.router.post('/', AUTORIZA_DEPARTAMENTO_CONTROLADOR.CrearAutorizaDepartamento);
    }
}

const AUTORIZA_DEPARTAMENTO_RUTAS = new DepartamentoRutas();

export default AUTORIZA_DEPARTAMENTO_RUTAS.router;