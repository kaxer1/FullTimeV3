import { Router } from 'express';
import rolPermisosControlador from '../../controlador/catalogos/catRolPermisosControlador';
import { TokenValidation } from '../../libs/VerificarToken';

class RolPermisosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, rolPermisosControlador.list);
        this.router.get('/:id', TokenValidation, rolPermisosControlador.getOne);
        this.router.post('/', TokenValidation, rolPermisosControlador.create);
        this.router.post('/denegado/', TokenValidation, rolPermisosControlador.createPermisoDenegado);
        this.router.get('/denegado/:id', TokenValidation, rolPermisosControlador.getPermisosUsuario);
    }
}

const rolPermisosRutas = new RolPermisosRutas();

export default rolPermisosRutas.router;