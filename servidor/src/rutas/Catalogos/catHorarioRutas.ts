import { Router } from 'express';
import HORARIO_CONTROLADOR from '../../controlador/catalogos/catHorarioControlador';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './docRespaldosHorarios',
});

class HorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', HORARIO_CONTROLADOR.ListarHorarios);
        this.router.get('/:id', HORARIO_CONTROLADOR.ObtenerUnHorario);
        this.router.post('/', HORARIO_CONTROLADOR.CrearHorario);
        this.router.post('/uploads', multipartMiddleware, HORARIO_CONTROLADOR.CrearHorarioPlantilla);
        this.router.post('/cargaMultiple/upload', multipartMiddleware, HORARIO_CONTROLADOR.CrearHorarioyDetallePlantilla);
        this.router.put('/editar/:id', HORARIO_CONTROLADOR.EditarHorario);
        this.router.post('/xmlDownload/', HORARIO_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', HORARIO_CONTROLADOR.downloadXML);
        this.router.get('/documentos/:docs', HORARIO_CONTROLADOR.ObtenerDocumento);
        this.router.put('/:id/documento', multipartMiddleware, HORARIO_CONTROLADOR.GuardarDocumentoHorario);
        this.router.put('/editar/editarDocumento/:id', HORARIO_CONTROLADOR.EditarDocumento);

    }
}

const HORARIO_RUTAS = new HorarioRutas();

export default HORARIO_RUTAS.router;