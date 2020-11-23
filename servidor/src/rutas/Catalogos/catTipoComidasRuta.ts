import { Router } from 'express';
import TIPO_COMIDAS_CONTROLADOR from '../../controlador/catalogos/catTipoComidasControlador';
import { TokenValidation } from '../../libs/verificarToken';

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
        this.router.get('/', TokenValidation, TIPO_COMIDAS_CONTROLADOR.ListarTipoComidas);
        this.router.get('/:id', TokenValidation, TIPO_COMIDAS_CONTROLADOR.ListarUnTipoComida);
        this.router.post('/', TokenValidation, TIPO_COMIDAS_CONTROLADOR.CrearTipoComidas);
        this.router.put('/', TokenValidation, TIPO_COMIDAS_CONTROLADOR.ActualizarComida);
        this.router.delete('/eliminar/:id', TokenValidation, TIPO_COMIDAS_CONTROLADOR.EliminarRegistros);
        this.router.post('/xmlDownload/', TokenValidation, TIPO_COMIDAS_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', TIPO_COMIDAS_CONTROLADOR.downloadXML);
        // Validaciones de datos antes da registra los datos de la plantilla indicada
        this.router.post('/verificar_datos/upload', TokenValidation, multipartMiddleware, TIPO_COMIDAS_CONTROLADOR.RevisarDatos);
        this.router.post('/verificar_plantilla/upload', TokenValidation, multipartMiddleware, TIPO_COMIDAS_CONTROLADOR.RevisarDatos_Duplicados);
        this.router.post('/upload', TokenValidation, multipartMiddleware, TIPO_COMIDAS_CONTROLADOR.CrearTipoComidasPlantilla);
        
   
    }
}

const TIPO_COMIDAS_RUTA = new TipoComidasRuta();

export default TIPO_COMIDAS_RUTA.router;