import { NextFunction, Request, Response } from 'express';

export const ModuloAlimentacionValidation = (req: Request, res: Response, next: NextFunction) => {

    const { alimentacion } = req.modulos;
    console.log('******************** validacion de modulo de alimentacion', alimentacion);
    
    if (!alimentacion) return res.status(401).jsonp({access: false, message: 'No tiene acceso a los recursos del módulo de alimentacion'})
    
    console.log('******************** si tiene acceso modulo de alimentacion', alimentacion);
    next()
}