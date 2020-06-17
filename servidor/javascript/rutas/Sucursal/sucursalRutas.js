"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sucursalControlador_1 = __importDefault(require("../../controlador/sucursal/sucursalControlador"));
class SucursalRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', sucursalControlador_1.default.ListarSucursales);
        this.router.get('/unaSucursal/:id', sucursalControlador_1.default.ObtenerUnaSucursal);
        this.router.get('/buscar/nombreSuc/:id_empresa', sucursalControlador_1.default.ObtenerSucursalEmpresa);
        this.router.post('/', sucursalControlador_1.default.CrearSucursal);
        this.router.get('/ultimoId', sucursalControlador_1.default.ObtenerUltimoId);
        this.router.put('/', sucursalControlador_1.default.ActualizarSucursal);
        this.router.post('/xmlDownload/', sucursalControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', sucursalControlador_1.default.downloadXML);
    }
}
const SUCURSAL_RUTAS = new SucursalRutas();
exports.default = SUCURSAL_RUTAS.router;
