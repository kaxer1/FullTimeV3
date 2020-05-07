import { Router } from 'express';

import CONTRATO_EMPLEADO_CONTROLADOR from '../../../controlador/empleado/empleadoContrato/contratoEmpleadoControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', CONTRATO_EMPLEADO_CONTROLADOR.ListarContratos);
        this.router.get('/:id_empleado', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarIdContrato);
        this.router.get('/contrato/:id_empleado', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarContratoIdEmpleado);
        this.router.get('/contratoRegimen/:id_empleado', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarContratoEmpleadoRegimen);
        this.router.post('/', CONTRATO_EMPLEADO_CONTROLADOR.CrearContrato);
    }
}

const CONTRATO_EMPLEADO_RUTAS = new DepartamentoRutas();

export default CONTRATO_EMPLEADO_RUTAS.router;