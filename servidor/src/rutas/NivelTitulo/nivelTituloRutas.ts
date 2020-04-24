import { Router } from 'express';
import nivelTituloControlador from '../../controlador/nivelTitulo/nivelTituloControlador';


class NivelTituloRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', nivelTituloControlador.list);
        this.router.get('/:id', nivelTituloControlador.getOne);
        this.router.post('/', nivelTituloControlador.create);
    }
}

const nivelTituloRutas = new NivelTituloRutas();

export default nivelTituloRutas.router;