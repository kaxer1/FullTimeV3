import { Router } from 'express';
import tipoPermisosControlador from '../../controlador/catalogos/catTipoPermisosControlador';

class TipoPermisosRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', tipoPermisosControlador.list);
        this.router.get('/acceso/:acce_empleado', tipoPermisosControlador.listAccess);
        this.router.get('/:id', tipoPermisosControlador.getOne);
        this.router.post('/', tipoPermisosControlador.create);
        this.router.put('/editar/:id', tipoPermisosControlador.editar);
    }
}

const tipoPermisosRutas = new TipoPermisosRutas();

export default tipoPermisosRutas.router;