import { Router } from 'express';
import TIPO_PERMISOS_CONTROLADOR from '../../controlador/catalogos/catTipoPermisosControlador';

class TipoPermisosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TIPO_PERMISOS_CONTROLADOR.list);
        this.router.get('/:id', TIPO_PERMISOS_CONTROLADOR.getOne);
        this.router.post('/', TIPO_PERMISOS_CONTROLADOR.create);
        this.router.put('/editar/:id', TIPO_PERMISOS_CONTROLADOR.editar);
        this.router.post('/xmlDownload/', TIPO_PERMISOS_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', TIPO_PERMISOS_CONTROLADOR.downloadXML);
        this.router.get('/acceso/:acce_empleado', TIPO_PERMISOS_CONTROLADOR.listAccess);
    }
}

const TIPO_PERMISOS_RUTAS = new TipoPermisosRutas();

export default TIPO_PERMISOS_RUTAS.router;