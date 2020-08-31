import { Router } from 'express';
import HORARIO_CONTROLADOR from '../../controlador/catalogos/catHorarioControlador';
import { TokenValidation } from '../../libs/VerificarToken';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});

const multipartMiddlewareD = multipart({
    uploadDir: './docRespaldosHorarios',
});

class HorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, HORARIO_CONTROLADOR.ListarHorarios);
        this.router.get('/:id', TokenValidation, HORARIO_CONTROLADOR.ObtenerUnHorario);
        this.router.post('/', TokenValidation, HORARIO_CONTROLADOR.CrearHorario);
        this.router.post('/cargaMultiple/upload', [TokenValidation, multipartMiddleware], HORARIO_CONTROLADOR.CrearHorarioyDetallePlantilla);
        this.router.put('/editar/:id', TokenValidation, HORARIO_CONTROLADOR.EditarHorario);
        this.router.post('/xmlDownload/', TokenValidation, HORARIO_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', HORARIO_CONTROLADOR.downloadXML);
        this.router.get('/documentos/:docs', HORARIO_CONTROLADOR.ObtenerDocumento);
        this.router.put('/:id/documento', [TokenValidation, multipartMiddlewareD], HORARIO_CONTROLADOR.GuardarDocumentoHorario);
        this.router.put('/editar/editarDocumento/:id', TokenValidation, HORARIO_CONTROLADOR.EditarDocumento);
        this.router.post('/cargarHorario/upload', [TokenValidation, multipartMiddleware], HORARIO_CONTROLADOR.CargarHorarioPlantilla);

    }
}

const HORARIO_RUTAS = new HorarioRutas();

export default HORARIO_RUTAS.router;