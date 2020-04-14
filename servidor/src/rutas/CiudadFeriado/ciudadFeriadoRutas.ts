import { Router } from 'express';
import CIUDAD_FERIADO_CONTROLADOR from '../../controlador/CiudadFeriado/ciudadFeriadoControlador';

class CiudadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.post('/insertar', CIUDAD_FERIADO_CONTROLADOR.AsignarCiudadFeriado);
        this.router.post('/buscar', CIUDAD_FERIADO_CONTROLADOR.ObtenerIdCiudades);
        this.router.get('/:nombre', CIUDAD_FERIADO_CONTROLADOR.FiltrarCiudadesProvincia);
        this.router.get('/nombresCiudades/:idferiado', CIUDAD_FERIADO_CONTROLADOR.EncontrarCiudadesFeriado);
    }
}

const CIUDAD_FERIADOS_RUTAS = new CiudadRutas();

export default CIUDAD_FERIADOS_RUTAS.router;