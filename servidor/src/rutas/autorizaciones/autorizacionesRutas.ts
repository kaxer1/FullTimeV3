import { Router } from 'express';
import AUTORIZACIONES_CONTROLADOR from '../../controlador/autorizaciones/autorizacionesControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', AUTORIZACIONES_CONTROLADOR.ListarAutorizaciones);
        this.router.get('/by-permiso/:id_permiso', AUTORIZACIONES_CONTROLADOR.ObtenerAutorizacionByPermiso);
        this.router.get('/by-vacacion/:id_vacacion', AUTORIZACIONES_CONTROLADOR.ObtenerAutorizacionByVacacion);
        this.router.get('/by-hora-extra/:id_hora_extra', AUTORIZACIONES_CONTROLADOR.ObtenerAutorizacionByHoraExtra);
        this.router.post('/', AUTORIZACIONES_CONTROLADOR.CrearAutorizacion);
        this.router.put('/:id/estado-permiso', AUTORIZACIONES_CONTROLADOR.ActualizarEstadoPermiso);
        this.router.put('/:id/estado-vacacion', AUTORIZACIONES_CONTROLADOR.ActualizarEstadoVacacion);
        this.router.put('/:id/estado-hora-extra', AUTORIZACIONES_CONTROLADOR.ActualizarEstadoHoraExtra);
    }
}

const AUTORIZA_DEPARTAMENTO_RUTAS = new DepartamentoRutas();

export default AUTORIZA_DEPARTAMENTO_RUTAS.router;