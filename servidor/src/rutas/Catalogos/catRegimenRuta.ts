import { Router } from 'express';
import REGIMEN_CONTROLADOR from '../../controlador/catalogos/catRegimenControlador';

class RegimenRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', REGIMEN_CONTROLADOR.ListarRegimen);
        this.router.get('/:id', REGIMEN_CONTROLADOR.ListarUnRegimen);
        this.router.post('/', REGIMEN_CONTROLADOR.CrearRegimen);
        this.router.put('/', REGIMEN_CONTROLADOR.ActualizarRegimen);
        // this.router.delete('/:id', pruebaControlador.delete);
    }
}

const REGIMEN_RUTA = new RegimenRuta();

export default REGIMEN_RUTA.router;