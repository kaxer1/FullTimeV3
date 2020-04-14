import { Router } from 'express';
import HORARIO_CONTROLADOR from '../../controlador/catalogos/catHorarioControlador';

const multipart = require('connect-multiparty');  

const multipartMiddleware = multipart({  
    uploadDir: './plantillas',
});

class HorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', HORARIO_CONTROLADOR.ListarHorarios);
        this.router.get('/:id',  HORARIO_CONTROLADOR.ObtenerUnHorario);
        this.router.post('/', HORARIO_CONTROLADOR.CrearHorario);
        this.router.post('/upload', multipartMiddleware, HORARIO_CONTROLADOR.CrearHorarioPlantilla);
    }
}

const HORARIO_RUTAS = new HorarioRutas();

export default HORARIO_RUTAS.router;