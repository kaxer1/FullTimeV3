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
        this.router.get('/lista/', PERMISOS_CONTROLADOR.ListarEstadosPermisos);
        this.router.get('/:id', PERMISOS_CONTROLADOR.ObtenerUnPermiso);
        this.router.get('/un-permiso/:id_permiso', PERMISOS_CONTROLADOR.ListarUnPermisoInfo);
        this.router.post('/', PERMISOS_CONTROLADOR.CrearPermisos);
        this.router.get('/documentos/:docs', PERMISOS_CONTROLADOR.getDoc);
        this.router.get('/numPermiso/:id_empleado',  PERMISOS_CONTROLADOR.ObtenerNumPermiso);
        this.router.get('/permisoContrato/:id_empl_contrato',  PERMISOS_CONTROLADOR.ObtenerPermisoContrato);
        this.router.put('/:id/documento', multipartMiddleware, PERMISOS_CONTROLADOR.guardarDocumentoPermiso);
        this.router.put('/:id/estado', PERMISOS_CONTROLADOR.ActualizarEstado);
    }
}

const PERMISOS_RUTAS = new PermisosRutas();

export default PERMISOS_RUTAS.router;