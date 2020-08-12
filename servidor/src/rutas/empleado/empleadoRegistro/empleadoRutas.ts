import { Router, NextFunction, Request, Response } from 'express';
import EMPLEADO_CONTROLADOR from '../../../controlador/empleado/empleadoRegistro/empleadoControlador';

const jwt = require('jsonwebtoken');

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './imagenesEmpleados',
});

const multipartMiddlewarePlantilla = multipart({
    uploadDir: './plantillas',
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
        this.router.get('/download/:nameXML', EMPLEADO_CONTROLADOR.downloadXML);
        this.router.get('/emplTitulos/:id_empleado', this.verifyToken, EMPLEADO_CONTROLADOR.getTitulosDelEmpleado);
        this.router.put('/:id/usuario', this.verifyToken, EMPLEADO_CONTROLADOR.editar);
        this.router.put('/:id_empleado/uploadImage', [this.verifyToken, multipartMiddleware], EMPLEADO_CONTROLADOR.crearImagenEmpleado);
        this.router.put('/:id_empleado_titulo/titulo', this.verifyToken, EMPLEADO_CONTROLADOR.editarTituloDelEmpleado);
        this.router.post('/', this.verifyToken, EMPLEADO_CONTROLADOR.create);
        this.router.post('/xmlDownload/', this.verifyToken, EMPLEADO_CONTROLADOR.FileXML);
        this.router.post('/emplTitulos/', this.verifyToken, EMPLEADO_CONTROLADOR.createEmpleadoTitulos);
        this.router.post('/plantillaExcel/', [this.verifyToken, multipartMiddlewarePlantilla], EMPLEADO_CONTROLADOR.CargaPlantillaEmpleadoUsuario);
        this.router.delete('/eliminar/titulo/:id_empleado_titulo', this.verifyToken, EMPLEADO_CONTROLADOR.eliminarTituloDelEmpleado);
        this.router.post('/buscarDepartamento', EMPLEADO_CONTROLADOR.ObtenerDepartamentoEmpleado);
        this.router.get('/encontrarDato/codigo', EMPLEADO_CONTROLADOR.ObtenerCodigo);
        this.router.post('/crearCodigo', EMPLEADO_CONTROLADOR.CrearCodigo);
        this.router.put('/cambiarCodigo', EMPLEADO_CONTROLADOR.ActualizarCodigo);
    }

    verifyToken(req: Request, res: Response, next: NextFunction) {
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
        const payload = jwt.verify(token, 'llaveSecreta')
        // cuando se extrae los datos se guarda en una propiedad req.userId para q las demas funciones puedan utilizar ese id 
        req.body.userId = payload._id;
        req.body.userName = payload._userName;
        next();
    }
}

const EMPLEADO_RUTAS = new EmpleadoRutas();

export default EMPLEADO_RUTAS.router;
