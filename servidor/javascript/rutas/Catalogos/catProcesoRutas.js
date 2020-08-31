"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catProcesoControlador_1 = __importDefault(require("../../controlador/catalogos/catProcesoControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class ProcesoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, catProcesoControlador_1.default.list);
        this.router.get('/busqueda/:nombre', VerificarToken_1.TokenValidation, catProcesoControlador_1.default.getIdByNombre);
        this.router.get('/:id', VerificarToken_1.TokenValidation, catProcesoControlador_1.default.getOne);
        this.router.post('/', VerificarToken_1.TokenValidation, catProcesoControlador_1.default.create);
        this.router.put('/', VerificarToken_1.TokenValidation, catProcesoControlador_1.default.ActualizarProceso);
        this.router.delete('/eliminar/:id', VerificarToken_1.TokenValidation, catProcesoControlador_1.default.EliminarProceso);
        this.router.post('/xmlDownload/', VerificarToken_1.TokenValidation, catProcesoControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catProcesoControlador_1.default.downloadXML);
    }
}
const PROCESO_RUTAS = new ProcesoRutas();
exports.default = PROCESO_RUTAS.router;
