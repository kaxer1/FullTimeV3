import { Router } from 'express';
import LOGIN_CONTROLADOR from '../../controlador/login/loginControlador';

class LoginRuta {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.post('/', LOGIN_CONTROLADOR.ValidarCredenciales);
    }

}

const LOGIN_RUTA = new LoginRuta();

export default LOGIN_RUTA.router;