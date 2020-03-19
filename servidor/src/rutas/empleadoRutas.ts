import { Router } from 'express';

import empleadoControlador from '../controlador/empleadoControlador';

class EmpleadoRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', empleadoControlador.list);
        this.router.get('/:id', empleadoControlador.getOne);
        this.router.post('/', empleadoControlador.create);
        this.router.get('/emplTitulos/:id_empleado', empleadoControlador.getTitulosDelEmpleado);
        this.router.post('/emplTitulos/', empleadoControlador.createEmpleadoTitulos);
    }
}

const empleadoRutas = new EmpleadoRutas();

export default empleadoRutas.router;
