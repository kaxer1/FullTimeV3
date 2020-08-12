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
        this.router.post('/mail-noti/', HorasExtrasPedidasControlador.SendMailNotifiPermiso);
        this.router.get('/datosSolicitud/:id_emple_hora', HorasExtrasPedidasControlador.ObtenerSolicitudHoraExtra);
        this.router.put('/:id/estado', HorasExtrasPedidasControlador.ActualizarEstado);
        this.router.put('/:id/hora-extra-solicitada', HorasExtrasPedidasControlador.EditarHoraExtra);
        this.router.get('/datosAutorizacion/:id_hora/:id_empleado', HorasExtrasPedidasControlador.ObtenerAutorizacionHoraExtra);
        this.router.delete('/eliminar/:id_hora_extra', HorasExtrasPedidasControlador.EliminarHoraExtra);
    }
}

const HORA_EXTRA_PEDIDA_RUTA = new HorasExtrasPedidasRutas();

export default HORA_EXTRA_PEDIDA_RUTA.router;