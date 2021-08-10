import { NextFunction, Request, Response } from 'express';

export const ModuloAccionesPersonalValidation = (req: Request, res: Response, next: NextFunction) => {

    const { accion_personal } = req.modulos;
    console.log('******************** validacion de modulo de accion_personal', accion_personal);
    
    if (!accion_personal) return res.status(401).jsonp({
        access: false, 
        message: 'Ups! Al parecer no tienes activado en tu plan el módulo de acciones de personal. Te gustaría activarlo? Comunícate con nosotros', 
        url: 'www.casapazmino.com.ec'
    })
    
    console.log('******************** si tiene acceso modulo de accion_personal', accion_personal);
    next()
}