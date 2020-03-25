import { Router } from 'express';

import HORARIO_CONTROLADOR from '../../controlador/catalogos/catHorarioControlador';

class HorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', HORARIO_CONTROLADOR.ListarHorarios);
        this.router.get('/:id',  HORARIO_CONTROLADOR.ObtenerUnHorario);
        this.router.post('/', HORARIO_CONTROLADOR.CrearHorario);
    }
}

const HORARIO_RUTAS = new HorarioRutas();

export default HORARIO_RUTAS.router;