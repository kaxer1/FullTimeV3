"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sucursalControlador_1 = __importDefault(require("../../controlador/Sucursal/sucursalControlador"));
class SucursalRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', sucursalControlador_1.default.ListarSucursales);
        this.router.get('/id:', sucursalControlador_1.default.ObtenerUnaSucursal);
        this.router.post('/', sucursalControlador_1.default.CrearSucursal);
    }
}
const SUCURSAL_RUTAS = new SucursalRutas();
exports.default = SUCURSAL_RUTAS.router;
