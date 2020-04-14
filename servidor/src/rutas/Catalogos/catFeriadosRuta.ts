import { Router } from 'express';
import FERIADOS_CONTROLADOR from '../../controlador/Catalogos/catFeriadosControlador';

const multipart = require('connect-multiparty');  

const multipartMiddleware = multipart({  
    uploadDir: './plantillas',
});

class FeriadosRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', FERIADOS_CONTROLADOR.ListarFeriados);
        this.router.get('/ultimoId', FERIADOS_CONTROLADOR.ObtenerUltimoId);
        this.router.get('/:id', FERIADOS_CONTROLADOR.ObtenerUnFeriado);
        this.router.post('/', FERIADOS_CONTROLADOR.CrearFeriados);
        this.router.post('/upload', multipartMiddleware, FERIADOS_CONTROLADOR.CrearFeriadoPlantilla);
        this.router.put('/', FERIADOS_CONTROLADOR.ActualizarFeriado);
    }
}

const FERIADOS_RUTA = new FeriadosRuta();

export default FERIADOS_RUTA.router;