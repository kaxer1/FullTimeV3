import { Router } from 'express';
import DOCUMENTOS_CONTROLADOR from '../../controlador/documentos/documentosControlador';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './documentacion',
});

class DoumentosRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DOCUMENTOS_CONTROLADOR.ListarDocumentos);
        this.router.get('/:id', DOCUMENTOS_CONTROLADOR.ObtenerUnDocumento);
        this.router.post('/', DOCUMENTOS_CONTROLADOR.CrearDocumento);
        this.router.put('/editar/:id', DOCUMENTOS_CONTROLADOR.EditarDocumento);
        this.router.get('/documentos/:docs', DOCUMENTOS_CONTROLADOR.ObtenerDocumento);
        this.router.put('/:id/documento', multipartMiddleware, DOCUMENTOS_CONTROLADOR.GuardarDocumentos);
    }
}

const DOCUMENTOS_RUTAS = new DoumentosRutas();

export default DOCUMENTOS_RUTAS.router;