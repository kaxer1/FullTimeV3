import { Router } from 'express';
import TIPO_COMIDAS_CONTROLADOR from '../../controlador/catalogos/catTipoComidasControlador';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});

class TipoComidasRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TIPO_COMIDAS_CONTROLADOR.ListarTipoComidas);
        this.router.get('/:id', TIPO_COMIDAS_CONTROLADOR.ListarUnTipoComida);
        this.router.post('/', TIPO_COMIDAS_CONTROLADOR.CrearTipoComidas);
        this.router.put('/', TIPO_COMIDAS_CONTROLADOR.ActualizarComida);
        this.router.delete('/eliminar/:id', TIPO_COMIDAS_CONTROLADOR.EliminarRegistros);
        this.router.post('/xmlDownload/', TIPO_COMIDAS_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', TIPO_COMIDAS_CONTROLADOR.downloadXML);
        this.router.post('/upload', multipartMiddleware, TIPO_COMIDAS_CONTROLADOR.CrearTipoComidasPlantilla);
    }
}

const TIPO_COMIDAS_RUTA = new TipoComidasRuta();

export default TIPO_COMIDAS_RUTA.router;