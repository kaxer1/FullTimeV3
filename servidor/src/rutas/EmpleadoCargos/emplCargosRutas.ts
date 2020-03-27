import { Router } from 'express';

import EMPLEADO_CARGO_CONTROLADOR from '../../controlador/EmpleadoCargos/emplCargosControlador';

class EmpleadosCargpsRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', EMPLEADO_CARGO_CONTROLADOR.list);
        this.router.get('/:id', EMPLEADO_CARGO_CONTROLADOR.getOne);
        this.router.post('/', EMPLEADO_CARGO_CONTROLADOR.create);
    }
}

const EMPLEADO_CARGO_RUTAS = new EmpleadosCargpsRutas();

export default EMPLEADO_CARGO_RUTAS.router;