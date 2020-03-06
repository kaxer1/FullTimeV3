import { Router } from 'express';

import DEPARTAMENTO_CONTROLADOR from '../../controlador/Catalogos/departamentoControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DEPARTAMENTO_CONTROLADOR.list);
        this.router.get('/:id',  DEPARTAMENTO_CONTROLADOR.getOne);
        this.router.post('/', DEPARTAMENTO_CONTROLADOR.create);
        this.router.get('/busqueda/:nombre', DEPARTAMENTO_CONTROLADOR.getIdByNombre);
    }
}

const DEPARTAMENTO_RUTAS = new DepartamentoRutas();

export default DEPARTAMENTO_RUTAS.router;