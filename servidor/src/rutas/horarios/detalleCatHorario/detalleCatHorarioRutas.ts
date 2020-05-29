import { Router } from 'express';
import DETALLE_CATALOGO_HORARIO_CONTROLADOR from '../../../controlador/horarios/detalleCatHorario/detalleCatHorarioControlador';

class PermisosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DETALLE_CATALOGO_HORARIO_CONTROLADOR.ListarDetalleHorarios);
        this.router.post('/', DETALLE_CATALOGO_HORARIO_CONTROLADOR.CrearDetalleHorarios);
        this.router.get('/:id_horario', DETALLE_CATALOGO_HORARIO_CONTROLADOR.ListarUnDetalleHorario);
    }
}

const DETALLE_CATALOGO_HORARIO_RUTAS = new PermisosRutas();

export default DETALLE_CATALOGO_HORARIO_RUTAS.router;