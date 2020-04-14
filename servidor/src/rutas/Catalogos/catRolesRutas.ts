import { Router } from 'express';
import ROLES_CONTROLADOR from '../../controlador/Catalogos/catRolesControlador';

class PruebasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', ROLES_CONTROLADOR.list);
        this.router.get('/:id', ROLES_CONTROLADOR.getOne);
        this.router.post('/', ROLES_CONTROLADOR.create);
        // this.router.put('/:id', pruebaControlador.update);
        // this.router.delete('/:id', pruebaControlador.delete);
    }
}

const ROLES_RUTAS = new PruebasRutas();

export default ROLES_RUTAS.router;