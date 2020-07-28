import { Router } from 'express';

import CONTRATO_EMPLEADO_CONTROLADOR from '../../../controlador/empleado/empleadoContrato/contratoEmpleadoControlador';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './contratos',
});
class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', CONTRATO_EMPLEADO_CONTROLADOR.ListarContratos);
        this.router.get('/:id/get', CONTRATO_EMPLEADO_CONTROLADOR.ObtenerUnContrato);
        this.router.get('/:id_empleado', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarIdContrato);
        this.router.get('/contratoActual/:id_empleado', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarIdContratoActual);
        this.router.get('/contrato/:id', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarDatosUltimoContrato);
        this.router.get('/contratoRegimen/:id_empleado', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarContratoEmpleadoRegimen);
        this.router.post('/', CONTRATO_EMPLEADO_CONTROLADOR.CrearContrato);
        this.router.put('/:id_empleado/:id/actualizar', CONTRATO_EMPLEADO_CONTROLADOR.EditarContrato);
        this.router.put('/:id/documento', multipartMiddleware, CONTRATO_EMPLEADO_CONTROLADOR.GuardarDocumentoContrato);
        this.router.get('/documentos/:docs', CONTRATO_EMPLEADO_CONTROLADOR.ObtenerDocumento);
        this.router.put('/editar/editarDocumento/:id', CONTRATO_EMPLEADO_CONTROLADOR.EditarDocumento);
        this.router.post('/buscarFecha', CONTRATO_EMPLEADO_CONTROLADOR.EncontrarFechaContrato);
    }
}

const CONTRATO_EMPLEADO_RUTAS = new DepartamentoRutas();

export default CONTRATO_EMPLEADO_RUTAS.router;