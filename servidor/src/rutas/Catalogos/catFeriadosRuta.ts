import { Router } from 'express';

import FERIADOS_CONTROLADOR from '../../controlador/Catalogos/catFeriadosControlador';

class FeriadosRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', FERIADOS_CONTROLADOR.ListarFeriados);
        this.router.get('/buscarDescripcion/:descripcion', FERIADOS_CONTROLADOR.ListarFeriadoDescripcion);
        this.router.get('/buscarFecha/:fecha', FERIADOS_CONTROLADOR.ListarFeriadoFecha);
        this.router.post('/', FERIADOS_CONTROLADOR.CrearFeriados);
        this.router.put('/:id', FERIADOS_CONTROLADOR.ActualizarFeriado);
    }
}

const FERIADOS_RUTA = new FeriadosRuta();

export default FERIADOS_RUTA.router;