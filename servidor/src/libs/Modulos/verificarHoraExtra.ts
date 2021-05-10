import { NextFunction, Request, Response } from 'express';

export const ModuloHoraExtraValidation = (req: Request, res: Response, next: NextFunction) => {

    const { hora_extra } = req.modulos;
    console.log('******************** validacion de modulo de Hora Extra', hora_extra);
    
    if (!hora_extra) return res.status(401).jsonp({access: false, message: 'No tiene acceso a los recursos del módulo de horas extras'})
    
    console.log('******************** si tiene acceso modulo de Hora Extra', hora_extra);
    next()
}