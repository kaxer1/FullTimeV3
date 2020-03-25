import { Router } from 'express';

import rolPermisosControlador from '../../controlador/catalogos/rolPermisosControlador';

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
        this.router.get('/denegado/:id', rolPermisosControlador.getPermisosUsuario);
    }
}

const rolPermisosRutas = new RolPermisosRutas();

export default rolPermisosRutas.router;