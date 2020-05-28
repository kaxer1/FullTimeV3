import { Router } from 'express';
import { USUARIO_CONTROLADOR } from '../../controlador/usuarios/usuarioControlador'


class UsuarioRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', USUARIO_CONTROLADOR.list);
        this.router.post('/', USUARIO_CONTROLADOR.create);
        this.router.get('/busqueda/:usuario', USUARIO_CONTROLADOR.getIdByUsuario);
        this.router.get('/datos/:id_empleado', USUARIO_CONTROLADOR.ObtenerDatosUsuario);
        this.router.put('/', USUARIO_CONTROLADOR.CambiarPasswordUsuario);
        this.router.get('/noEnrolados', USUARIO_CONTROLADOR.ListarUsuriosNoEnrolados);
    }
}

const USUARIO_RUTA = new UsuarioRutas();

export default USUARIO_RUTA.router;