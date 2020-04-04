import { Router } from 'express';

import PROCESO_CONTROLADOR from '../../controlador/catalogos/catProcesoControlador';

class ProcesoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PROCESO_CONTROLADOR.list);
        this.router.get('/busqueda/:nombre', PROCESO_CONTROLADOR.getIdByNombre);
        this.router.get('/:id',  PROCESO_CONTROLADOR.getOne);
        this.router.post('/', PROCESO_CONTROLADOR.create);    
    }
}

const PROCESO_RUTAS = new ProcesoRutas();

export default PROCESO_RUTAS.router;