import { Router } from 'express';

import VACACIONES_CONTROLADOR from '../../controlador/vacaciones/vacacionesControlador';

class SucursalRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', VACACIONES_CONTROLADOR.ListarVacaciones);
        this.router.get('/:id', VACACIONES_CONTROLADOR.VacacionesIdPeriodo);
        this.router.post('/', VACACIONES_CONTROLADOR.CrearVacaciones);
    }
}

const SUCURSAL_RUTAS = new SucursalRutas();

export default SUCURSAL_RUTAS.router;