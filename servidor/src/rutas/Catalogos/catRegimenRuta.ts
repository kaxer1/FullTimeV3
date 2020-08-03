import { Router } from 'express';
import REGIMEN_CONTROLADOR from '../../controlador/catalogos/catRegimenControlador';

class RegimenRuta {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', REGIMEN_CONTROLADOR.ListarRegimen);
        this.router.get('/:id', REGIMEN_CONTROLADOR.ListarUnRegimen);
        this.router.post('/', REGIMEN_CONTROLADOR.CrearRegimen);
        this.router.put('/', REGIMEN_CONTROLADOR.ActualizarRegimen);
        this.router.delete('/eliminar/:id', REGIMEN_CONTROLADOR.EliminarRegistros);
        this.router.post('/xmlDownload/', REGIMEN_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', REGIMEN_CONTROLADOR.downloadXML);
    }
}

const REGIMEN_RUTA = new RegimenRuta();

export default REGIMEN_RUTA.router;