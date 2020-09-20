import { Router } from 'express';
import PERMISOS_CONTROLADOR from '../../controlador/permisos/permisosControlador';
import { TokenValidation } from '../../libs/verificarToken'
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
        this.router.get('/', TokenValidation, PERMISOS_CONTROLADOR.ListarPermisos);
        this.router.get('/lista/', TokenValidation, PERMISOS_CONTROLADOR.ListarEstadosPermisos);
        this.router.get('/:id', TokenValidation, PERMISOS_CONTROLADOR.ObtenerUnPermiso);
        this.router.get('/un-permiso/:id_permiso', TokenValidation, PERMISOS_CONTROLADOR.ListarUnPermisoInfo);
        this.router.post('/', TokenValidation, PERMISOS_CONTROLADOR.CrearPermisos);
        this.router.post('/mail-noti/', TokenValidation, PERMISOS_CONTROLADOR.SendMailNotifiPermiso);
        this.router.get('/documentos/:docs', PERMISOS_CONTROLADOR.getDoc);
        this.router.get('/numPermiso/:id_empleado', TokenValidation, PERMISOS_CONTROLADOR.ObtenerNumPermiso);
        this.router.get('/permisoContrato/:id_empl_contrato', TokenValidation, PERMISOS_CONTROLADOR.ObtenerPermisoContrato);
        this.router.put('/:id/documento', [TokenValidation, multipartMiddleware], PERMISOS_CONTROLADOR.guardarDocumentoPermiso);
        this.router.put('/:id/estado', TokenValidation, PERMISOS_CONTROLADOR.ActualizarEstado);
        this.router.put('/:id/permiso-solicitado', TokenValidation, PERMISOS_CONTROLADOR.EditarPermiso);
        this.router.get('/datosSolicitud/:id_emple_permiso', TokenValidation, PERMISOS_CONTROLADOR.ObtenerDatosSolicitud);
        this.router.get('/datosAutorizacion/:id_permiso/:id_empleado', TokenValidation, PERMISOS_CONTROLADOR.ObtenerDatosAutorizacion);
        this.router.delete('/eliminar/:id_permiso/:doc', TokenValidation, PERMISOS_CONTROLADOR.EliminarPermiso);
    }
}

const PERMISOS_RUTAS = new PermisosRutas();

export default PERMISOS_RUTAS.router;