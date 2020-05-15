import { Router } from 'express';
import TITULO_CONTROLADOR from '../../controlador/catalogos/catTituloControlador';


class TituloRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TITULO_CONTROLADOR.list);
        this.router.get('/:id', TITULO_CONTROLADOR.getOne);
        this.router.post('/', TITULO_CONTROLADOR.create);
        this.router.put('/', TITULO_CONTROLADOR.ActualizarTitulo);
    }
}

const TITULO_RUTAS = new TituloRutas();

export default TITULO_RUTAS.router;