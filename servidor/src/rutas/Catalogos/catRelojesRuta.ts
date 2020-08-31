import { Router } from 'express';
import RELOJES_CONTROLADOR from '../../controlador/catalogos/catRelojesControlador';
import { TokenValidation } from '../../libs/VerificarToken';

const multipart = require('connect-multiparty');

const multipartMiddlewarePlantilla = multipart({
    uploadDir: './plantillas',
});

class RelojesRuta {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, RELOJES_CONTROLADOR.ListarRelojes);
        this.router.get('/:id', TokenValidation, RELOJES_CONTROLADOR.ListarUnReloj);
        this.router.post('/', TokenValidation, RELOJES_CONTROLADOR.CrearRelojes);
        this.router.post('/plantillaExcel/', [TokenValidation, multipartMiddlewarePlantilla], RELOJES_CONTROLADOR.CargaPlantillaRelojes);
        this.router.put('/', TokenValidation,RELOJES_CONTROLADOR.ActualizarReloj);
        this.router.post('/xmlDownload/', TokenValidation, RELOJES_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', RELOJES_CONTROLADOR.downloadXML);
        this.router.delete('/eliminar/:id', TokenValidation, RELOJES_CONTROLADOR.EliminarRegistros);
        this.router.get('/datosReloj/:id', TokenValidation, RELOJES_CONTROLADOR.ListarDatosUnReloj);
    }
}

const RELOJES_RUTA = new RelojesRuta();

export default RELOJES_RUTA.router;