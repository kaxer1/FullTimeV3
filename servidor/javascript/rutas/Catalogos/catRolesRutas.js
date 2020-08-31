"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catRolesControlador_1 = __importDefault(require("../../controlador/catalogos/catRolesControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class PruebasRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catRolesControlador_1.default.ListarRoles);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catRolesControlador_1.default.ObtnenerUnRol);
        this.router.post('/', VerificarToken_1.TokenValidation, catRolesControlador_1.default.CrearRol);
        this.router.put('/', VerificarToken_1.TokenValidation, catRolesControlador_1.default.ActualizarRol);
        // this.router.delete('/:id', pruebaControlador.delete);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catRolesControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catRolesControlador_1.default.downloadXML);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catRolesControlador_1.default.EliminarRol);
    }
}
const ROLES_RUTAS = new PruebasRutas();
exports.default = ROLES_RUTAS.router;
