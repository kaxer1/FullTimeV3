import { Router } from 'express';
import horasExtrasControlador from '../../controlador/catalogos/catHorasExtrasControlador';
import { TokenValidation } from '../../libs/verificarToken';

class HorasExtrasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, horasExtrasControlador.ListarHorasExtras);
        this.router.get('/:id', TokenValidation, horasExtrasControlador.ObtenerUnaHoraExtra);
        this.router.post('/', TokenValidation, horasExtrasControlador.CrearHoraExtra);
        this.router.delete('/eliminar/:id', TokenValidation, horasExtrasControlador.EliminarRegistros);
        this.router.post('/xmlDownload/', TokenValidation, horasExtrasControlador.FileXML);
        this.router.get('/download/:nameXML', horasExtrasControlador.downloadXML);
        this.router.put('/', TokenValidation, horasExtrasControlador.ActualizarHoraExtra);
    }
}

const HORA_EXTRA_RUTA = new HorasExtrasRutas();

export default HORA_EXTRA_RUTA.router;