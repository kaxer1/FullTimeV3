import { Router } from 'express';

import  PROVINCIA_CONTROLADOR  from '../../controlador/Catalogos/provinciaControlador';

class ProvinciaRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PROVINCIA_CONTROLADOR.list);
        this.router.get('/:id',  PROVINCIA_CONTROLADOR.getOne);
        this.router.post('/',  PROVINCIA_CONTROLADOR.create);
    }
}

const PROVINCIA_RUTAS = new ProvinciaRutas();

export default PROVINCIA_RUTAS.router;