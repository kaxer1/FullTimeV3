import { Router } from 'express';

<<<<<<< HEAD:servidor/src/rutas/Catalogos/catTituloRutas.ts
import tituloControlador from '../../controlador/catalogos/catTituloControlador';
=======
import tituloControlador from '../../controlador/Catalogos/tituloControlador';
>>>>>>> 06167363ec0cb38bfe8074c610dd2718b80dcecf:servidor/src/rutas/Catalogos/tituloRutas.ts

class TituloRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', tituloControlador.list);
        this.router.get('/:id', tituloControlador.getOne);
        this.router.post('/', tituloControlador.create);
    }
}

const tituloRutas = new TituloRutas();

export default tituloRutas.router;