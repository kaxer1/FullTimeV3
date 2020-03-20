import { Router } from 'express';

import  PROVINCIA_CONTROLADOR  from '../../controlador/Catalogos/catProvinciaControlador';

class ProvinciaRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PROVINCIA_CONTROLADOR.ListarProvincia);
        this.router.get('/:id',  PROVINCIA_CONTROLADOR.ObtenerUnaProvincia);
        this.router.post('/',  PROVINCIA_CONTROLADOR.CrearProvincia);
    }
}

const PROVINCIA_RUTAS = new ProvinciaRutas();

export default PROVINCIA_RUTAS.router;