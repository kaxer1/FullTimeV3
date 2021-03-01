import { Router } from 'express';
import { USUARIO_CONTROLADOR } from '../../controlador/usuarios/usuarioControlador'
import { TokenValidation } from '../../libs/verificarToken'

class UsuarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, USUARIO_CONTROLADOR.list);
        this.router.post('/', TokenValidation, USUARIO_CONTROLADOR.create);
        this.router.get('/busqueda/:usuario', TokenValidation, USUARIO_CONTROLADOR.getIdByUsuario);
        this.router.get('/datos/:id_empleado', TokenValidation, USUARIO_CONTROLADOR.ObtenerDatosUsuario);
        this.router.put('/', TokenValidation, USUARIO_CONTROLADOR.CambiarPasswordUsuario);
        this.router.get('/noEnrolados', TokenValidation, USUARIO_CONTROLADOR.ListarUsuriosNoEnrolados);
        this.router.put('/actualizarDatos', TokenValidation, USUARIO_CONTROLADOR.ActualizarUsuario);
        this.router.post('/acceso', USUARIO_CONTROLADOR.AuditarAcceso);
        this.router.put('/frase', TokenValidation, USUARIO_CONTROLADOR.ActualizarFrase);
    }
}

const USUARIO_RUTA = new UsuarioRutas();

export default USUARIO_RUTA.router;