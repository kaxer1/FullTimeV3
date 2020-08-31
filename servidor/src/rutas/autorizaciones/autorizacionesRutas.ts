import { Router } from 'express';
import AUTORIZACIONES_CONTROLADOR from '../../controlador/autorizaciones/autorizacionesControlador';
import { TokenValidation } from '../../libs/VerificarToken'

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, AUTORIZACIONES_CONTROLADOR.ListarAutorizaciones);
        this.router.get('/by-permiso/:id_permiso', TokenValidation, AUTORIZACIONES_CONTROLADOR.ObtenerAutorizacionByPermiso);
        this.router.get('/by-vacacion/:id_vacacion', TokenValidation, AUTORIZACIONES_CONTROLADOR.ObtenerAutorizacionByVacacion);
        this.router.get('/by-hora-extra/:id_hora_extra', AUTORIZACIONES_CONTROLADOR.ObtenerAutorizacionByHoraExtra);
        this.router.post('/', TokenValidation, AUTORIZACIONES_CONTROLADOR.CrearAutorizacion);
        this.router.put('/:id/estado-permiso', TokenValidation, AUTORIZACIONES_CONTROLADOR.ActualizarEstadoPermiso);
        this.router.put('/:id/estado-vacacion', TokenValidation, AUTORIZACIONES_CONTROLADOR.ActualizarEstadoVacacion);
        this.router.put('/:id/estado-hora-extra', TokenValidation, AUTORIZACIONES_CONTROLADOR.ActualizarEstadoHoraExtra);
    }
}

const AUTORIZA_DEPARTAMENTO_RUTAS = new DepartamentoRutas();

export default AUTORIZA_DEPARTAMENTO_RUTAS.router;