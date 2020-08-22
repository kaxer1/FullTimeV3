import {KARDEX_VACACION_CONTROLADOR} from '../../controlador/reportes/kardexVacacionesControlador';
import {Router} from 'express'
import {TokenValidation} from '../../libs/verificarToken';

class KardexVacacionesRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, KARDEX_VACACION_CONTROLADOR.varcularVacacion);
    }


}

export const KARDEX_VACACION_RUTAS = new KardexVacacionesRutas();

export default KARDEX_VACACION_RUTAS.router;