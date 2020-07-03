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
        this.router.get('/one/:id', VACACIONES_CONTROLADOR.ListarUnaVacacion);
        this.router.post('/', VACACIONES_CONTROLADOR.CrearVacaciones);
        this.router.post('/fechasFeriado', VACACIONES_CONTROLADOR.ObtenerFechasFeriado);
        this.router.put('/:id/estado', VACACIONES_CONTROLADOR.ActualizarEstado);
    }
}

const SUCURSAL_RUTAS = new SucursalRutas();

export default SUCURSAL_RUTAS.router;