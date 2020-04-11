import { Router } from 'express';

import FERIADOS_CONTROLADOR from '../../controlador/catalogos/catFeriadosControlador';

class FeriadosRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', FERIADOS_CONTROLADOR.ListarFeriados);
        this.router.get('/ultimoId', FERIADOS_CONTROLADOR.ObtenerUltimoId);
        this.router.get('/:id', FERIADOS_CONTROLADOR.ObtenerUnFeriado);
        this.router.post('/', FERIADOS_CONTROLADOR.CrearFeriados);
        this.router.put('/', FERIADOS_CONTROLADOR.ActualizarFeriado);
    }
}

const FERIADOS_RUTA = new FeriadosRuta();

export default FERIADOS_RUTA.router;