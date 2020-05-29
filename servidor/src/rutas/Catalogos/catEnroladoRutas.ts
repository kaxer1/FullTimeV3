import { Router, NextFunction, Request, Response } from 'express';
import ENROLADOS_CONTROLADOR from '../../controlador/catalogos/catEnroladoControlador';

const jwt = require('jsonwebtoken');

const multipart = require('connect-multiparty');  

const multipartMiddlewarePlantilla = multipart({  
    uploadDir: './plantillas',
});

class EnroladoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', this.verifyToken, ENROLADOS_CONTROLADOR.ListarEnrolados);
        this.router.get('/:id', this.verifyToken, ENROLADOS_CONTROLADOR.ObtenerUnEnrolado);
        this.router.post('/', this.verifyToken, ENROLADOS_CONTROLADOR.CrearEnrolado);
        this.router.post('/plantillaExcel/', [this.verifyToken, multipartMiddlewarePlantilla], ENROLADOS_CONTROLADOR.CargaPlantillaEnrolado);
        this.router.get('/busqueda/:id_usuario', this.verifyToken, ENROLADOS_CONTROLADOR.ObtenerRegistroEnrolado);
        this.router.get('/buscar/ultimoId', this.verifyToken, ENROLADOS_CONTROLADOR.ObtenerUltimoId);
        this.router.put('/', this.verifyToken, ENROLADOS_CONTROLADOR.ActualizarEnrolado);
        this.router.delete('/eliminar/:id', ENROLADOS_CONTROLADOR.EliminarEnrolado)
    }

    verifyToken(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorize Request');
        }

        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null'){
            return res.status(401).send('Unauthorize Request');
        }
       
        const payload = jwt.verify(token, 'llaveSecreta')
        req.body.userId = payload._id;
        next();
    }
}

const ENROLADO_RUTAS = new EnroladoRutas();

export default ENROLADO_RUTAS.router;