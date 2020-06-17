import { Router } from 'express';

import EMPLEADO_CARGO_CONTROLADOR from '../../../controlador/empleado/empleadoCargos/emplCargosControlador';

class EmpleadosCargpsRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', EMPLEADO_CARGO_CONTROLADOR.list);
        this.router.get('/lista-empleados/', EMPLEADO_CARGO_CONTROLADOR.ListarCargoEmpleado);
        this.router.get('/:id', EMPLEADO_CARGO_CONTROLADOR.getOne);
        this.router.get('/cargoInfo/:id_empl_contrato', EMPLEADO_CARGO_CONTROLADOR.EncontrarInfoCargoEmpleado);
        this.router.post('/', EMPLEADO_CARGO_CONTROLADOR.Crear);
        this.router.get('/buscar/:id_empleado', EMPLEADO_CARGO_CONTROLADOR.EncontrarIdCargo);
        this.router.get('/buscar/cargoActual/:id_empleado', EMPLEADO_CARGO_CONTROLADOR.EncontrarIdCargoActual);
        this.router.put('/:id_empl_contrato/:id/actualizar', EMPLEADO_CARGO_CONTROLADOR.EditarCargo);
    }
}

const EMPLEADO_CARGO_RUTAS = new EmpleadosCargpsRutas();

export default EMPLEADO_CARGO_RUTAS.router;