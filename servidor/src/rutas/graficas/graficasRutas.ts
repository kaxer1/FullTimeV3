import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import GRAFICAS_CONTROLADOR from '../../controlador/graficas/graficasControlador';

class GraficasRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/inasistencia', TokenValidation, GRAFICAS_CONTROLADOR.ObtenerInasistencia);
        // this.router.post('/insertar', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.AsignarRelojEnrolado);
        // this.router.post('/buscar', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.ObtenerIdReloj);
        // this.router.put('/', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.ActualizarRelojEnrolado);
        // this.router.delete('/eliminar/:id', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.EliminarRelojEnrolado);
    }
}

const GRAFICAS_RUTAS = new GraficasRutas();

export default GRAFICAS_RUTAS.router;
