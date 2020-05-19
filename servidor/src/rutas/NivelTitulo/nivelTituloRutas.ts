import { Router } from 'express';
import NIVEL_TITULO_CONTROLADOR from '../../controlador/nivelTitulo/NivelTituloControlador';


class NivelTituloRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', NIVEL_TITULO_CONTROLADOR.list);
        this.router.get('/:id', NIVEL_TITULO_CONTROLADOR.getOne);
        this.router.post('/', NIVEL_TITULO_CONTROLADOR.create);
        this.router.get('/buscar/:nombre', NIVEL_TITULO_CONTROLADOR.ObtenerNivelNombre);
        this.router.put('/', NIVEL_TITULO_CONTROLADOR.ActualizarNivelTitulo);
    }
}

const NIVEL_TITULO_RUTAS = new NivelTituloRutas();

export default NIVEL_TITULO_RUTAS.router;