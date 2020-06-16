"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catEnroladoControlador_1 = __importDefault(require("../../controlador/catalogos/catEnroladoControlador"));
const jwt = require('jsonwebtoken');
const multipart = require('connect-multiparty');
const multipartMiddlewarePlantilla = multipart({
    uploadDir: './plantillas',
});
class EnroladoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', this.verifyToken, catEnroladoControlador_1.default.ListarEnrolados);
        this.router.get('/:id', this.verifyToken, catEnroladoControlador_1.default.ObtenerUnEnrolado);
        this.router.post('/', this.verifyToken, catEnroladoControlador_1.default.CrearEnrolado);
        this.router.post('/plantillaExcel/', [this.verifyToken, multipartMiddlewarePlantilla], catEnroladoControlador_1.default.CargaPlantillaEnrolado);
        this.router.get('/busqueda/:id_usuario', this.verifyToken, catEnroladoControlador_1.default.ObtenerRegistroEnrolado);
        this.router.get('/buscar/ultimoId', this.verifyToken, catEnroladoControlador_1.default.ObtenerUltimoId);
        this.router.put('/', this.verifyToken, catEnroladoControlador_1.default.ActualizarEnrolado);
        this.router.delete('/eliminar/:id', catEnroladoControlador_1.default.EliminarEnrolado);
        this.router.post('/xmlDownload/', catEnroladoControlador_1.default.FileXML);
        this.router.get('/download/:nameXML', catEnroladoControlador_1.default.downloadXML);
    }
    verifyToken(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorize Request');
        }
        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send('Unauthorize Request');
        }
        const payload = jwt.verify(token, 'llaveSecreta');
        req.body.userId = payload._id;
        next();
    }
}
const ENROLADO_RUTAS = new EnroladoRutas();
exports.default = ENROLADO_RUTAS.router;
