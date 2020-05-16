"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoRegistro/empleadoControlador"));
const jwt = require('jsonwebtoken');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './imagenesEmpleados',
});
class EmpleadoRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', this.verifyToken, empleadoControlador_1.default.list);
        this.router.get('/:id', this.verifyToken, empleadoControlador_1.default.getOne);
        this.router.get('/img/:imagen', empleadoControlador_1.default.getImagen);
        this.router.get('/emplTitulos/:id_empleado', this.verifyToken, empleadoControlador_1.default.getTitulosDelEmpleado);
        this.router.put('/:id/usuario', this.verifyToken, empleadoControlador_1.default.editar);
        this.router.put('/:id_empleado/uploadImage', [this.verifyToken, multipartMiddleware], empleadoControlador_1.default.crearImagenEmpleado);
        this.router.put('/:id_empleado_titulo/titulo', this.verifyToken, empleadoControlador_1.default.editarTituloDelEmpleado);
        this.router.post('/', this.verifyToken, empleadoControlador_1.default.create);
        this.router.post('/emplTitulos/', this.verifyToken, empleadoControlador_1.default.createEmpleadoTitulos);
        this.router.delete('/eliminar/titulo/:id_empleado_titulo', this.verifyToken, empleadoControlador_1.default.eliminarTituloDelEmpleado);
    }
    verifyToken(req, res, next) {
        // verifica si en la peticion existe la cabecera autorizacion 
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorize Request');
        }
        // si existe pasa a la siguiente
        // para verificar si el token esta vacio
        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send('Unauthorize Request');
        }
        // si el token no esta vacio
        // se extrae los datos del token 
        const payload = jwt.verify(token, 'llaveSecreta');
        // cuando se extrae los datos se guarda en una propiedad req.userId para q las demas funciones puedan utilizar ese id 
        req.body.userId = payload._id;
        next();
    }
}
const EMPLEADO_RUTAS = new EmpleadoRutas();
exports.default = EMPLEADO_RUTAS.router;
