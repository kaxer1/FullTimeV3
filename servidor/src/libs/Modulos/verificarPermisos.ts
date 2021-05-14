import { NextFunction, Request, Response } from 'express';

export const ModuloPermisosValidation = (req: Request, res: Response, next: NextFunction) => {

    const { permisos } = req.modulos;
    console.log('******************** validacion de modulo de permisos', permisos);
    
    if (!permisos) return res.status(401).jsonp({access: false, message: 'No tiene acceso a los recursos del módulo de permisos'})
    
    console.log('******************** si tiene acceso modulo de permisos', permisos);
    next()
}