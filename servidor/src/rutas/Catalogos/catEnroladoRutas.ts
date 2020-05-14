import { Router } from 'express';
import ENROLADOS_CONTROLADOR from '../../controlador/catalogos/catEnroladoControlador';

class EnroladoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', ENROLADOS_CONTROLADOR.ListarEnrolados);
        this.router.get('/:id',  ENROLADOS_CONTROLADOR.ObtenerUnEnrolado);
        this.router.post('/', ENROLADOS_CONTROLADOR.CrearEnrolado);
        this.router.get('/busqueda/:id_usuario', ENROLADOS_CONTROLADOR.ObtenerRegistroEnrolado);
        this.router.get('/buscar/ultimoId', ENROLADOS_CONTROLADOR.ObtenerUltimoId);
        this.router.put('/', ENROLADOS_CONTROLADOR.ActualizarEnrolado);
    }
}

const ENROLADO_RUTAS = new EnroladoRutas();

export default ENROLADO_RUTAS.router;