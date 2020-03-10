import { Router } from 'express';

import FERIADOS_CONTROLADOR from '../../controlador/Catalogos/catFeriadosControlador';

class FeriadosRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', FERIADOS_CONTROLADOR.ListarFeriados);
        this.router.get('/:id', FERIADOS_CONTROLADOR.ListarUnFeriado);
        this.router.get('/buscarDescripcion/:descripcion', FERIADOS_CONTROLADOR.ListarFeriadoDescripcion);
        this.router.post('/', FERIADOS_CONTROLADOR.CrearFeriados);
    }
}

const FERIADOS_RUTA = new FeriadosRuta();

export default FERIADOS_RUTA.router;