import { Router } from 'express';
import EMPLEADO_HORARIOS_CONTROLADOR from '../../../controlador/horarios/empleadoHorarios/empleadoHorariosControlador';
import { TokenValidation } from '../../../libs/VerificarToken'

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});

class EmpleadoHorariosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, EMPLEADO_HORARIOS_CONTROLADOR.ListarEmpleadoHorarios);
        this.router.post('/', TokenValidation, EMPLEADO_HORARIOS_CONTROLADOR.CrearEmpleadoHorarios);
        this.router.get('/horarioCargo/:id_empl_cargo', TokenValidation, EMPLEADO_HORARIOS_CONTROLADOR.ListarHorarioCargo);
        this.router.post('/upload/:id', [TokenValidation, multipartMiddleware], EMPLEADO_HORARIOS_CONTROLADOR.CrearHorarioEmpleadoPlantilla);
        this.router.post('/cargaMultiple', [TokenValidation, multipartMiddleware], EMPLEADO_HORARIOS_CONTROLADOR.CargarMultiplesHorariosEmpleadosPlantilla);
        this.router.post('/horas', TokenValidation, EMPLEADO_HORARIOS_CONTROLADOR.ObtenerNumeroHoras);
        this.router.put('/', TokenValidation, EMPLEADO_HORARIOS_CONTROLADOR.ActualizarEmpleadoHorarios);
        this.router.delete('/eliminar/:id', TokenValidation, EMPLEADO_HORARIOS_CONTROLADOR.EliminarRegistros);
    }
}

const EMPLEADO_HORARIOS_RUTAS = new EmpleadoHorariosRutas();

export default EMPLEADO_HORARIOS_RUTAS.router;