"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuloAccionesPersonalValidation = void 0;
exports.ModuloAccionesPersonalValidation = (req, res, next) => {
    const { accion_personal } = req.modulos;
    console.log('******************** validacion de modulo de accion_personal', accion_personal);
    if (!accion_personal)
        return res.status(401).jsonp({
            access: false,
            message: 'Ups! Al parecer no tienes activado en tu plan el módulo de acciones de personal. Te gustaría activarlo? Comunícate con nosotros',
            url: 'www.casapazmino.com.ec'
        });
    console.log('******************** si tiene acceso modulo de accion_personal', accion_personal);
    next();
};
