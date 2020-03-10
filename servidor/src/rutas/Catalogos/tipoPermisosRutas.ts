import { Router } from 'express';

import tipoPermisosControlador from '../../controlador/Catalogos/tipoPermisosControlador';

class TipoPermisosRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', tipoPermisosControlador.list);
        this.router.get('/:id', tipoPermisosControlador.getOne);
        this.router.post('/', tipoPermisosControlador.create);
    }
}

const tipoPermisosRutas = new TipoPermisosRutas();

export default tipoPermisosRutas.router;