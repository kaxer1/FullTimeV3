import { Router } from 'express';

import loginControlador from '../../controlador/login/loginControlador';

class LoginRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {

        this.router.post('/', loginControlador.validar);
    }
}

const loginRuta = new LoginRuta();

export default loginRuta.router;