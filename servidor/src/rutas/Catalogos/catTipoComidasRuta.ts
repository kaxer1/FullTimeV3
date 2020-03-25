import { Router } from 'express';

import TIPO_COMIDAS_CONTROLADOR from '../../controlador/catalogos/catTipoComidasControlador';

class TipoComidasRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TIPO_COMIDAS_CONTROLADOR.ListarTipoComidas);
        this.router.get('/:id', TIPO_COMIDAS_CONTROLADOR.ListarUnTipoComida);
        this.router.post('/', TIPO_COMIDAS_CONTROLADOR.CrearTipoComidas);
        // this.router.put('/:id', pruebaControlador.update);
        // this.router.delete('/:id', pruebaControlador.delete);
    }
}

const TIPO_COMIDAS_RUTA = new TipoComidasRuta();

export default TIPO_COMIDAS_RUTA.router;