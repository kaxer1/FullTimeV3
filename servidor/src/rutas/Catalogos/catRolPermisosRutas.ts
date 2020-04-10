import { Router } from 'express';

<<<<<<< HEAD:servidor/src/rutas/Catalogos/catRolPermisosRutas.ts
import rolPermisosControlador from '../../controlador/catalogos/catRolPermisosControlador';
=======
import rolPermisosControlador from '../../controlador/Catalogos/rolPermisosControlador';
>>>>>>> 06167363ec0cb38bfe8074c610dd2718b80dcecf:servidor/src/rutas/Catalogos/rolPermisosRutas.ts

class RolPermisosRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', rolPermisosControlador.list);
        this.router.get('/:id', rolPermisosControlador.getOne);
        this.router.post('/', rolPermisosControlador.create);
        this.router.post('/denegado/', rolPermisosControlador.createPermisoDenegado);
        this.router.get('/denegado/:id', rolPermisosControlador.getPermisosUsuario);
    }
}

const rolPermisosRutas = new RolPermisosRutas();

export default rolPermisosRutas.router;