import { Router } from 'express';

import HORARIO_CONTROLADOR from '../../controlador/Catalogos/catHorarioControlador';

class HorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', HORARIO_CONTROLADOR.list);
        this.router.get('/:id',  HORARIO_CONTROLADOR.getOne);
        this.router.post('/', HORARIO_CONTROLADOR.create);
    }
}

const HORARIO_RUTAS = new HorarioRutas();

export default HORARIO_RUTAS.router;