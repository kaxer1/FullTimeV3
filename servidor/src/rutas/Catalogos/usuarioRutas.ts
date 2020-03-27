import { Router } from 'express';
import {USUARIO_CONTROLADOR} from '../../controlador/Catalogos/usuarioControlador'

class UsuarioRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', USUARIO_CONTROLADOR.list);
        this.router.post('/', USUARIO_CONTROLADOR.create);
        this.router.get('/busqueda/:usuario', USUARIO_CONTROLADOR.getIdByUsuario);
    }
}

const USUARIO_RUTA = new UsuarioRutas();

export default USUARIO_RUTA.router;