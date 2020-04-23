import { Router } from 'express';
import nacionalidadControlador from '../../controlador/Nacionalidad/nacionalidadControlador';

class NacionalidadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', nacionalidadControlador.list);
    }
}

const nacionalidadRutas = new NacionalidadRutas();

export default nacionalidadRutas.router;