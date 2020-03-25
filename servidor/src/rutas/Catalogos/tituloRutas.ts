import { Router } from 'express';

import tituloControlador from '../../controlador/catalogos/tituloControlador';

class TituloRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', tituloControlador.list);
        this.router.get('/:id', tituloControlador.getOne);
        this.router.post('/', tituloControlador.create);
    }
}

const tituloRutas = new TituloRutas();

export default tituloRutas.router;