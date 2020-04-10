import { Router } from 'express';

<<<<<<< HEAD
import horasExtrasControlador from '../../controlador/catalogos/catHorasExtrasControlador';
=======
import horasExtrasControlador from '../../controlador/Catalogos/horasExtrasControlador';
>>>>>>> 06167363ec0cb38bfe8074c610dd2718b80dcecf

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