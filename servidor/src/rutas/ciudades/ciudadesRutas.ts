import { Router } from 'express';

import CIUDAD_CONTROLADOR from '../../controlador/ciudad/ciudadControlador';

class CiudadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', CIUDAD_CONTROLADOR.ListarCiudad);
        this.router.get('/:id', CIUDAD_CONTROLADOR.ConsularUnaCiudad);
        this.router.post('/', CIUDAD_CONTROLADOR.CrearCiudad);
    }
}

const CIUDAD_RUTAS = new CiudadRutas();

export default CIUDAD_RUTAS.router;