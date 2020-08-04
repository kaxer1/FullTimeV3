import { Router } from 'express';
import horasExtrasControlador from '../../controlador/catalogos/catHorasExtrasControlador';

class HorasExtrasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', horasExtrasControlador.ListarHorasExtras);
        this.router.get('/:id', horasExtrasControlador.ObtenerUnaHoraExtra);
        this.router.post('/', horasExtrasControlador.CrearHoraExtra);
        this.router.delete('/eliminar/:id', horasExtrasControlador.EliminarRegistros);
        this.router.post('/xmlDownload/', horasExtrasControlador.FileXML);
        this.router.get('/download/:nameXML', horasExtrasControlador.downloadXML);
    }
}

const HORA_EXTRA_RUTA = new HorasExtrasRutas();

export default HORA_EXTRA_RUTA.router;