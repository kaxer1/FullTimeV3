import { Router } from 'express';
import HorasExtrasPedidasControlador from '../../controlador/horaExtra/horaExtraControlador';
import { TokenValidation } from '../../libs/verificarToken'

class HorasExtrasPedidasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, HorasExtrasPedidasControlador.ListarHorasExtrasPedidas);
        this.router.get('/:id', TokenValidation, HorasExtrasPedidasControlador.ObtenerUnaHoraExtraPedida);
        this.router.get('/lista/:id_user', TokenValidation, HorasExtrasPedidasControlador.ObtenerlistaHora);
        this.router.post('/', TokenValidation, HorasExtrasPedidasControlador.CrearHoraExtraPedida);
        this.router.post('/mail-noti/', TokenValidation, HorasExtrasPedidasControlador.SendMailNotifiHoraExtra);
        this.router.get('/datosSolicitud/:id_emple_hora', TokenValidation, HorasExtrasPedidasControlador.ObtenerSolicitudHoraExtra);
        this.router.put('/:id/estado', TokenValidation, HorasExtrasPedidasControlador.ActualizarEstado);
        this.router.put('/:id/hora-extra-solicitada', TokenValidation, HorasExtrasPedidasControlador.EditarHoraExtra);
        this.router.get('/datosAutorizacion/:id_hora/:id_empleado', TokenValidation, HorasExtrasPedidasControlador.ObtenerAutorizacionHoraExtra);
        this.router.get('/horario-empleado/:id_cargo', TokenValidation, HorasExtrasPedidasControlador.ObtenerHorarioEmpleado);
        this.router.put('/tiempo-autorizado/:id_hora', TokenValidation, HorasExtrasPedidasControlador.TiempoAutorizado);
        this.router.delete('/eliminar/:id_hora_extra', TokenValidation, HorasExtrasPedidasControlador.EliminarHoraExtra);
    }
}

const HORA_EXTRA_PEDIDA_RUTA = new HorasExtrasPedidasRutas();

export default HORA_EXTRA_PEDIDA_RUTA.router;