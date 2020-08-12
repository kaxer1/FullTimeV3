"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRolesControlador_1 = __importDefault(require("../../controlador/catalogos/catRolesControlador"));
class PruebasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catRolesControlador_1.default.ListarRoles);
        this.router.get('/:id', catRolesControlador_1.default.ObtnenerUnRol);
        this.router.post('/', catRolesControlador_1.default.CrearRol);
        this.router.put('/', catRolesControlador_1.default.ActualizarRol);
        // this.router.delete('/:id', pruebaControlador.delete);
        this.router.post('/xmlDownload/', catRolesControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catRolesControlador_1.default.downloadXML);
        this.router.delete('/eliminar/:id', catRolesControlador_1.default.EliminarRol);
    }
}
const ROLES_RUTAS = new PruebasRutas();
exports.default = ROLES_RUTAS.router;
