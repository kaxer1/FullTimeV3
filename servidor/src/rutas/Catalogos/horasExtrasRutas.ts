import { Router } from 'express';

import horasExtrasControlador from '../../controlador/Catalogos/horasExtrasControlador';

class HorasExtrasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', horasExtrasControlador.list);
        this.router.get('/:id', horasExtrasControlador.getOne);
        this.router.post('/', horasExtrasControlador.create);
    }
}

const horaExtraRutas = new HorasExtrasRutas();

export default horaExtraRutas.router;