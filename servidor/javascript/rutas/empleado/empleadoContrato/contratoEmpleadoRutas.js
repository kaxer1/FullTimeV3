"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contratoEmpleadoControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoContrato/contratoEmpleadoControlador"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './contratos',
});
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', contratoEmpleadoControlador_1.default.ListarContratos);
        this.router.get('/:id/get', contratoEmpleadoControlador_1.default.ObtenerUnContrato);
        this.router.get('/:id_empleado', contratoEmpleadoControlador_1.default.EncontrarIdContrato);
        this.router.get('/contratoActual/:id_empleado', contratoEmpleadoControlador_1.default.EncontrarIdContratoActual);
        this.router.get('/contrato/:id', contratoEmpleadoControlador_1.default.EncontrarDatosUltimoContrato);
        this.router.get('/contratoRegimen/:id_empleado', contratoEmpleadoControlador_1.default.EncontrarContratoEmpleadoRegimen);
        this.router.post('/', contratoEmpleadoControlador_1.default.CrearContrato);
        this.router.put('/:id_empleado/:id/actualizar', contratoEmpleadoControlador_1.default.EditarContrato);
        this.router.put('/:id/documento', multipartMiddleware, contratoEmpleadoControlador_1.default.GuardarDocumentoContrato);
        this.router.get('/documentos/:docs', contratoEmpleadoControlador_1.default.ObtenerDocumento);
        this.router.put('/editar/editarDocumento/:id', contratoEmpleadoControlador_1.default.EditarDocumento);
        this.router.post('/buscarFecha', contratoEmpleadoControlador_1.default.EncontrarFechaContrato);
    }
}
const CONTRATO_EMPLEADO_RUTAS = new DepartamentoRutas();
exports.default = CONTRATO_EMPLEADO_RUTAS.router;
