import { NextFunction, Request, Response } from 'express';

export const ModuloReportesValidation = (req: Request, res: Response, next: NextFunction) => {

    const { reportes } = req.modulos;
    console.log('******************** validacion de modulo de reportes', reportes);
    
    if (!reportes) return res.status(401).jsonp({access: false, message: 'No tiene acceso a los recursos del módulo de reportes'})
    
    console.log('******************** si tiene acceso modulo de reportes', reportes);
    next()
}