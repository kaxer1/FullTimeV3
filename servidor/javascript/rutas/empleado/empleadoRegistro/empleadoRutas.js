"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoRegistro/empleadoControlador"));
const VerificarToken_1 = require("../../../libs/VerificarToken");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './imagenesEmpleados',
});
const multipartMiddlewarePlantilla = multipart({
    uploadDir: './plantillas',
});
class EmpleadoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, empleadoControlador_1.default.list);
        this.router.get('/buscador-empl', VerificarToken_1.TokenValidation, empleadoControlador_1.default.ListaBusquedaEmpleados);
        this.router.get('/:id', VerificarToken_1.TokenValidation, empleadoControlador_1.default.getOne);
        this.router.get('/img/:imagen', empleadoControlador_1.default.getImagen);
        this.router.get('/download/:nameXML', empleadoControlador_1.default.downloadXML);
        this.router.get('/emplTitulos/:id_empleado', VerificarToken_1.TokenValidation, empleadoControlador_1.default.getTitulosDelEmpleado);
        this.router.put('/:id/usuario', VerificarToken_1.TokenValidation, empleadoControlador_1.default.editar);
        this.router.put('/:id_empleado/uploadImage', [VerificarToken_1.TokenValidation, multipartMiddleware], empleadoControlador_1.default.crearImagenEmpleado);
        this.router.put('/:id_empleado_titulo/titulo', VerificarToken_1.TokenValidation, empleadoControlador_1.default.editarTituloDelEmpleado);
        this.router.post('/', VerificarToken_1.TokenValidation, empleadoControlador_1.default.create);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, empleadoControlador_1.default.FileXML);
        this.router.post('/emplTitulos/', VerificarToken_1.TokenValidation, empleadoControlador_1.default.createEmpleadoTitulos);
        this.router.post('/plantillaExcel/', [VerificarToken_1.TokenValidation, multipartMiddlewarePlantilla], empleadoControlador_1.default.CargaPlantillaEmpleadoUsuario);
        this.router.delete('/eliminar/titulo/:id_empleado_titulo', VerificarToken_1.TokenValidation, empleadoControlador_1.default.eliminarTituloDelEmpleado);
        this.router.post('/buscarDepartamento', VerificarToken_1.TokenValidation, empleadoControlador_1.default.ObtenerDepartamentoEmpleado);
        this.router.get('/encontrarDato/codigo', VerificarToken_1.TokenValidation, empleadoControlador_1.default.ObtenerCodigo);
        this.router.post('/crearCodigo', VerificarToken_1.TokenValidation, empleadoControlador_1.default.CrearCodigo);
        this.router.put('/cambiarCodigo', VerificarToken_1.TokenValidation, empleadoControlador_1.default.ActualizarCodigo);
    }
}
const EMPLEADO_RUTAS = new EmpleadoRutas();
exports.default = EMPLEADO_RUTAS.router;
