import { Router } from 'express';
import PERMISOS_CONTROLADOR from '../../controlador/permisos/permisosControlador';

class PermisosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PERMISOS_CONTROLADOR.ListarPermisos);
        this.router.post('/', PERMISOS_CONTROLADOR.CrearPermisos);
        this.router.get('/numPermiso/:id_empleado',  PERMISOS_CONTROLADOR.ObtenerNumPermiso);
        this.router.get('/permisoContrato/:id_empl_contrato',  PERMISOS_CONTROLADOR.ObtenerPermisoContrato);
    }
}

const PERMISOS_RUTAS = new PermisosRutas();

export default PERMISOS_RUTAS.router;