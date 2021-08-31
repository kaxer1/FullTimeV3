import { Router } from 'express';
import { TokenValidation } from '../../../libs/verificarToken';
import PERIODO_VACACION_CONTROLADOR from '../../../controlador/empleado/empleadoPeriodoVacacion/periodoVacacionControlador';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, PERIODO_VACACION_CONTROLADOR.ListarPerVacaciones);
        this.router.get('/infoPeriodo/:codigo', TokenValidation, PERIODO_VACACION_CONTROLADOR.EncontrarPerVacaciones);
        this.router.get('/buscar/:id_empleado', TokenValidation, PERIODO_VACACION_CONTROLADOR.EncontrarIdPerVacaciones);
        this.router.post('/', TokenValidation, PERIODO_VACACION_CONTROLADOR.CrearPerVacaciones);
        this.router.put('/', TokenValidation, PERIODO_VACACION_CONTROLADOR.ActualizarPeriodo);

        // Verificar datos de la plantilla de de periodo de vacaciones antes de subir al sistema
        this.router.post('/cargarPeriodo/upload', [TokenValidation, multipartMiddleware], PERIODO_VACACION_CONTROLADOR.CargarPeriodoVacaciones);
        this.router.post('/cargarPeriodo/verificarDatos/upload', [TokenValidation, multipartMiddleware], PERIODO_VACACION_CONTROLADOR.VerificarDatos);
        this.router.post('/cargarPeriodo/verificarPlantilla/upload', [TokenValidation, multipartMiddleware], PERIODO_VACACION_CONTROLADOR.VerificarPlantilla);
    }
}

const PERIODO_VACACION__RUTAS = new DepartamentoRutas();

export default PERIODO_VACACION__RUTAS.router;