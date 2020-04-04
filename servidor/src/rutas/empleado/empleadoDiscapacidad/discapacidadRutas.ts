import { Router } from 'express';

import discapacidadControlador from '../../../controlador/empleado/empleadoDiscapacidad/discapacidadControlador';

class DiscapacidadRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', discapacidadControlador.list);
        this.router.get('/:id_empleado', discapacidadControlador.getOne);
        this.router.post('/', discapacidadControlador.create);
        this.router.put('/:id_empleado', discapacidadControlador.update);
    }
}

const discapacidadRutas = new DiscapacidadRutas();

export default discapacidadRutas.router;