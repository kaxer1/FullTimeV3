import { Router } from 'express';
import PERMISOS_CONTROLADOR from '../../controlador/permisos/permisosControlador';
const multipart = require('connect-multiparty');  

const multipartMiddleware = multipart({  
    uploadDir: './docRespaldosPermisos',
});

class PermisosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PERMISOS_CONTROLADOR.ListarPermisos);
        this.router.post('/', PERMISOS_CONTROLADOR.CrearPermisos);
        this.router.put('/:id/documento', multipartMiddleware, PERMISOS_CONTROLADOR.guardarDocumentoPermiso);

    }
}

const PERMISOS_RUTAS = new PermisosRutas();

export default PERMISOS_RUTAS.router;