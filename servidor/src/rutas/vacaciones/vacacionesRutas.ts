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
        this.router.post('/mail-noti/', VACACIONES_CONTROLADOR.SendMailNotifiPermiso);
        this.router.put('/:id/estado', VACACIONES_CONTROLADOR.ActualizarEstado);
        this.router.get('/datosSolicitud/:id_emple_vacacion', VACACIONES_CONTROLADOR.ObtenerSolicitudVacaciones);
        this.router.get('/datosAutorizacion/:id_vacaciones/:id_empleado', VACACIONES_CONTROLADOR.ObtenerAutorizacionVacaciones);
    }
}

const SUCURSAL_RUTAS = new SucursalRutas();

export default SUCURSAL_RUTAS.router;