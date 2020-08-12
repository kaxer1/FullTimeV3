import { Router } from 'express';
import DETALLE_CATALOGO_HORARIO_CONTROLADOR from '../../../controlador/horarios/detalleCatHorario/detalleCatHorarioControlador';
const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});

class PermisosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DETALLE_CATALOGO_HORARIO_CONTROLADOR.ListarDetalleHorarios);
        this.router.post('/', DETALLE_CATALOGO_HORARIO_CONTROLADOR.CrearDetalleHorarios);
        this.router.get('/:id_horario', DETALLE_CATALOGO_HORARIO_CONTROLADOR.ListarUnDetalleHorario);
        this.router.post('/upload', multipartMiddleware, DETALLE_CATALOGO_HORARIO_CONTROLADOR.CrearHorarioDetallePlantilla);
        this.router.put('/', DETALLE_CATALOGO_HORARIO_CONTROLADOR.ActualizarDetalleHorarios);
        this.router.delete('/eliminar/:id', DETALLE_CATALOGO_HORARIO_CONTROLADOR.EliminarRegistros);
    }
}

const DETALLE_CATALOGO_HORARIO_RUTAS = new PermisosRutas();

export default DETALLE_CATALOGO_HORARIO_RUTAS.router;