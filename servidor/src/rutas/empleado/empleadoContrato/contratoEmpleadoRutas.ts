import { Router } from 'express';
import { TokenValidation } from '../../../libs/VerificarToken';
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
        this.router.get('/', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.ListarContratos);
        this.router.get('/:id/get', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.ObtenerUnContrato);
        this.router.get('/:id_empleado', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EncontrarIdContrato);
        this.router.get('/contratoActual/:id_empleado', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EncontrarIdContratoActual);
        this.router.get('/contrato/:id', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EncontrarDatosUltimoContrato);
        this.router.get('/contratoRegimen/:id_empleado', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EncontrarContratoEmpleadoRegimen);
        this.router.post('/', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.CrearContrato);
        this.router.put('/:id_empleado/:id/actualizar', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EditarContrato);
        this.router.put('/:id/documento', [TokenValidation, multipartMiddleware], CONTRATO_EMPLEADO_CONTROLADOR.GuardarDocumentoContrato);
        this.router.get('/documentos/:docs', CONTRATO_EMPLEADO_CONTROLADOR.ObtenerDocumento);
        this.router.put('/editar/editarDocumento/:id', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EditarDocumento);
        this.router.post('/buscarFecha', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EncontrarFechaContrato);
        this.router.post('/buscarFecha/contrato', TokenValidation, CONTRATO_EMPLEADO_CONTROLADOR.EncontrarFechaContratoId);
    }
}

const CONTRATO_EMPLEADO_RUTAS = new DepartamentoRutas();

export default CONTRATO_EMPLEADO_RUTAS.router;