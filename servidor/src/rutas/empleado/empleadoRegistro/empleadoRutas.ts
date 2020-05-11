import { Router, NextFunction, Request, Response  } from 'express';
import EMPLEADO_CONTROLADOR from '../../../controlador/empleado/empleadoRegistro/empleadoControlador';

const jwt = require('jsonwebtoken');

const multipart = require('connect-multiparty');  

const multipartMiddleware = multipart({  
    uploadDir: './imagenesEmpleados',
});

class EmpleadoRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', this.verifyToken, EMPLEADO_CONTROLADOR.list);
        this.router.get('/:id', this.verifyToken, EMPLEADO_CONTROLADOR.getOne);
        this.router.get('/img/:imagen', EMPLEADO_CONTROLADOR.getImagen);
        this.router.post('/', this.verifyToken, EMPLEADO_CONTROLADOR.create);
        this.router.put('/:id_empleado/uploadImage', [this.verifyToken, multipartMiddleware], EMPLEADO_CONTROLADOR.crearImagenEmpleado);
        this.router.get('/emplTitulos/:id_empleado', this.verifyToken, EMPLEADO_CONTROLADOR.getTitulosDelEmpleado);
        this.router.post('/emplTitulos/', this.verifyToken, EMPLEADO_CONTROLADOR.createEmpleadoTitulos);
    }

    verifyToken(req: Request, res: Response, next: NextFunction) {
        // verifica si en la peticion existe la cabecera autorizacion 
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorize Request');
        }
        // si existe pasa a la siguiente
        // para verificar si el token esta vacio
        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null'){
            return res.status(401).send('Unauthorize Request');
        }
      
        // si el token no esta vacio
        // se extrae los datos del token 
        const payload = jwt.verify(token, 'llaveSecreta')
        // cuando se extrae los datos se guarda en una propiedad req.userId para q las demas funciones puedan utilizar ese id 
        req.body.userId = payload._id;
        next();
      }
}

const EMPLEADO_RUTAS= new EmpleadoRutas();

export default EMPLEADO_RUTAS.router;
