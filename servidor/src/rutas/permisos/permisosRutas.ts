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
    }
}

const PERMISOS_RUTAS = new PermisosRutas();

export default PERMISOS_RUTAS.router;