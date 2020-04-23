import { Router } from 'express';

import EMPLEADO_CONTROLADOR from '../../../controlador/empleado/empleadoRegistro/empleadoControlador';

class EmpleadoRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', EMPLEADO_CONTROLADOR.list);
        this.router.get('/nacionalidades', EMPLEADO_CONTROLADOR.ListarNacionalidades);
        this.router.get('/:id', EMPLEADO_CONTROLADOR.getOne);
        this.router.post('/', EMPLEADO_CONTROLADOR.create);
        this.router.get('/emplTitulos/:id_empleado', EMPLEADO_CONTROLADOR.getTitulosDelEmpleado);
        this.router.post('/emplTitulos/', EMPLEADO_CONTROLADOR.createEmpleadoTitulos);
    }
}

const EMPLEADO_RUTAS= new EmpleadoRutas();

export default EMPLEADO_RUTAS.router;
