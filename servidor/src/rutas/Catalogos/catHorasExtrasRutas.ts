import { Router } from 'express';
import horasExtrasControlador from '../../controlador/Catalogos/catHorasExtrasControlador';

class HorasExtrasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', horasExtrasControlador.ListarHorasExtras);
        this.router.get('/:id', horasExtrasControlador.ObtenerUnaHoraExtra);
        this.router.post('/', horasExtrasControlador.CrearHoraExtra);
    }
}

const HORA_EXTRA_RUTA = new HorasExtrasRutas();

export default HORA_EXTRA_RUTA.router;