import { Router } from 'express';

import pruebaControlador from '../controlador/pruebaControlador';

class PruebasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', pruebaControlador.list);
        this.router.get('/:id', pruebaControlador.getOne);
        this.router.post('/', pruebaControlador.create);
        this.router.put('/:id', pruebaControlador.update);
        this.router.delete('/:id', pruebaControlador.delete);
    }
}

const pruebasRutas = new PruebasRutas();

export default pruebasRutas.router;