import { Router } from 'express';
import RELOJES_CONTROLADOR from '../../controlador/catalogos/catRelojesControlador';
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
        this.router.get('/', RELOJES_CONTROLADOR.ListarRelojes);
        this.router.get('/:id', RELOJES_CONTROLADOR.ListarUnReloj);
        this.router.post('/', RELOJES_CONTROLADOR.CrearRelojes);
        this.router.post('/plantillaExcel/', multipartMiddlewarePlantilla, RELOJES_CONTROLADOR.CargaPlantillaRelojes);
        this.router.put('/', RELOJES_CONTROLADOR.ActualizarReloj);
        this.router.post('/xmlDownload/', RELOJES_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', RELOJES_CONTROLADOR.downloadXML);
        this.router.delete('/eliminar/:id', RELOJES_CONTROLADOR.EliminarRegistros);
        this.router.get('/datosReloj/:id', RELOJES_CONTROLADOR.ListarDatosUnReloj);
    }
}

const RELOJES_RUTA = new RelojesRuta();

export default RELOJES_RUTA.router;