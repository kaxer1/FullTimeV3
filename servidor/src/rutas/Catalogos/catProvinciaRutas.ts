import { Router } from 'express';

import  PROVINCIA_CONTROLADOR  from '../../controlador/Catalogos/catProvinciaControlador';

class ProvinciaRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PROVINCIA_CONTROLADOR.ListarProvincia);
        this.router.get('/continentes', PROVINCIA_CONTROLADOR.ListarContinentes);
        this.router.get('/pais/:continente', PROVINCIA_CONTROLADOR.ListarPaises);
        this.router.get('/nombreProvincia/:nombre', PROVINCIA_CONTROLADOR.ObtenerIdProvincia);
        this.router.get('/:id_pais',  PROVINCIA_CONTROLADOR.ObtenerUnaProvincia);
        this.router.post('/',  PROVINCIA_CONTROLADOR.CrearProvincia);
    }
}

const PROVINCIA_RUTAS = new ProvinciaRutas();

export default PROVINCIA_RUTAS.router;