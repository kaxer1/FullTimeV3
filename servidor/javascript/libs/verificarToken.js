"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenValidation = (req, res, next) => {
    // verifica si en la peticion existe la cabecera autorizacion 
    if (!req.headers.authorization) {
        return res.status(401).send('No puede solicitar, permiso denegado');
    }
    // si existe pasa a la siguiente
    // para verificar si el token esta vacio
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('No continen token de autenticación');
    }
    // si el token no esta vacio
    // se extrae los datos del token 
    const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'llaveSecreta');
    // cuando se extrae los datos se guarda en una propiedad req.userId para q las demas funciones puedan utilizar ese id 
    // console.log(payload);
    req.userId = payload._id;
    req.userIdEmpleado = payload._id_empleado;
    req.id_empresa = payload._empresa,
        req.userRol = payload.rol;
    next();
};
