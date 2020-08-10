import { Router } from 'express';
import BIRTHDAY_CONTROLADOR from '../../controlador/birthday/birthdayControlador';
const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './cumpleanios',
});

class BirthdayRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/:id_empresa', BIRTHDAY_CONTROLADOR.MensajeEmpresa);
        this.router.get('/img/:imagen', BIRTHDAY_CONTROLADOR.getImagen);
        this.router.post('/', BIRTHDAY_CONTROLADOR.CrearMensajeBirthday);
        this.router.put('/:id_empresa/uploadImage', multipartMiddleware, BIRTHDAY_CONTROLADOR.CrearImagenEmpleado);
        this.router.put('/editar/:id_mensaje', BIRTHDAY_CONTROLADOR.EditarMensajeBirthday);
    }
}

const BIRTHDAY_RUTAS = new BirthdayRutas();

export default BIRTHDAY_RUTAS.router;