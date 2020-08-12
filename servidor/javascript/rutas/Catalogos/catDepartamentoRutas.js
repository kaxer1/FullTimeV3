"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catDepartamentoControlador_1 = __importDefault(require("../../controlador/catalogos/catDepartamentoControlador"));
class DepartamentoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catDepartamentoControlador_1.default.ListarDepartamentos);
        this.router.get('/nombreDepartamento', catDepartamentoControlador_1.default.ListarNombreDepartamentos);
        this.router.get('/idDepartamento/:nombre', catDepartamentoControlador_1.default.ListarIdDepartamentoNombre);
        this.router.get('/:id', catDepartamentoControlador_1.default.ObtenerUnDepartamento);
        this.router.get('/buscarDepa/:id_sucursal', catDepartamentoControlador_1.default.ObtenerDepartamentosSucursal);
        this.router.post('/', catDepartamentoControlador_1.default.CrearDepartamento);
        this.router.get('/busqueda/:nombre', catDepartamentoControlador_1.default.ObtenerIdDepartamento);
        this.router.get('/busqueda-contrato/:id_contrato', catDepartamentoControlador_1.default.BuscarDepartamentoPorContrato);
        this.router.put('/:id', catDepartamentoControlador_1.default.ActualizarDepartamento);
        this.router.post('/xmlDownload/', catDepartamentoControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catDepartamentoControlador_1.default.downloadXML);
        this.router.delete('/eliminar/:id', catDepartamentoControlador_1.default.EliminarRegistros);
        this.router.get('/buscar/datosDepartamento/:id_sucursal', catDepartamentoControlador_1.default.ListarDepartamentosSucursal);
    }
}
const DEPARTAMENTO_RUTAS = new DepartamentoRutas();
exports.default = DEPARTAMENTO_RUTAS.router;
