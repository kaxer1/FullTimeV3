import { Router } from 'express';
import HorasExtrasPedidasControlador from '../../controlador/horaExtra/horaExtraControlador';

class HorasExtrasPedidasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', HorasExtrasPedidasControlador.ListarHorasExtrasPedidas);
        this.router.get('/:id', HorasExtrasPedidasControlador.ObtenerUnaHoraExtraPedida);
        this.router.get('/lista/:id_user', HorasExtrasPedidasControlador.ObtenerlistaHora);
        this.router.post('/', HorasExtrasPedidasControlador.CrearHoraExtraPedida);
        this.router.get('/datosSolicitud/:id_emple_hora', HorasExtrasPedidasControlador.ObtenerSolicitudHoraExtra);
    
    }
}

const HORA_EXTRA_PEDIDA_RUTA = new HorasExtrasPedidasRutas();

export default HORA_EXTRA_PEDIDA_RUTA.router;