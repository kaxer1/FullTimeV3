import { Router } from 'express';

import empleadoControlador from '../controlador/empleadoControlador';

class EmpleadoRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', empleadoControlador.list);
        this.router.get('/:id', empleadoControlador.getOne);
    }
}

const empleadoRutas = new EmpleadoRutas();

export default empleadoRutas.router;
