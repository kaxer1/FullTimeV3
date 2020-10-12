import {KARDEX_VACACION_CONTROLADOR} from '../../controlador/reportes/kardexVacacionesControlador';
import {Router} from 'express'
import {TokenValidation} from '../../libs/verificarToken';

class KardexVacacionesRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        // solicita empleados
        this.router.get('/:desde/:hasta', TokenValidation, KARDEX_VACACION_CONTROLADOR.CarcularVacacionByIdToken);
        // solicita administrador
        this.router.get('/:id_empleado/:desde/:hasta', TokenValidation, KARDEX_VACACION_CONTROLADOR.CarcularVacacionByIdEmpleado);

        // Reporte de horas extras solo del empleado
        this.router.get('/hora-extra/:id_empleado/:desde/:hasta', TokenValidation, KARDEX_VACACION_CONTROLADOR.CarcularHorasExtras)
    }


}

export const KARDEX_VACACION_RUTAS = new KardexVacacionesRutas();

export default KARDEX_VACACION_RUTAS.router;