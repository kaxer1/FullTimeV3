import { Router } from 'express';

import rolPermisosControlador from '../../controlador/Catalogos/rolPermisosControlador';

class RolPermisosRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', rolPermisosControlador.list);
        this.router.get('/:id', rolPermisosControlador.getOne);
        this.router.post('/', rolPermisosControlador.create);
        this.router.post('/denegado/', rolPermisosControlador.createPermisoDenegado);
    }
}

const rolPermisosRutas = new RolPermisosRutas();

export default rolPermisosRutas.router;