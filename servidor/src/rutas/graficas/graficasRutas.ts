import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import GRAFICAS_CONTROLADOR from '../../controlador/graficas/graficasControlador';

class GraficasRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/admin/hora-extra/micro', TokenValidation, GRAFICAS_CONTROLADOR.AdminHorasExtrasMicro);
        this.router.get('/admin/hora-extra/macro/:desde/:hasta', TokenValidation, GRAFICAS_CONTROLADOR.AdminHorasExtrasMacro);
        
        this.router.get('/admin/retrasos/micro', TokenValidation, GRAFICAS_CONTROLADOR.AdminRetrasosMicro);
        this.router.get('/admin/retrasos/macro/:desde/:hasta', TokenValidation, GRAFICAS_CONTROLADOR.AdminRetrasosMacro);
        
        this.router.get('/admin/asistencia/micro', TokenValidation, GRAFICAS_CONTROLADOR.AdminAsistenciaMicro);
        this.router.get('/admin/asistencia/macro/:desde/:hasta', TokenValidation, GRAFICAS_CONTROLADOR.AdminAsistenciaMacro);
        
        this.router.get('/admin/jornada-vs-hora-extra/micro', TokenValidation, GRAFICAS_CONTROLADOR.AdminJornadaHorasExtrasMicro);
        this.router.get('/admin/jornada-vs-hora-extra/macro/:desde/:hasta', TokenValidation, GRAFICAS_CONTROLADOR.AdminJornadaHorasExtrasMacro);
        
        this.router.get('/admin/tiempo-jornada-vs-hora-ext/micro', TokenValidation, GRAFICAS_CONTROLADOR.AdminTiempoJornadaHorasExtrasMicro);
        this.router.get('/admin/tiempo-jornada-vs-hora-ext/macro/:desde/:hasta', TokenValidation, GRAFICAS_CONTROLADOR.AdminTiempoJornadaHorasExtrasMacro);

        this.router.get('/admin/inasistencia/micro', TokenValidation, GRAFICAS_CONTROLADOR.AdminInasistenciaMicro);
        this.router.get('/admin/inasistencia/macro/:desde/:hasta', TokenValidation, GRAFICAS_CONTROLADOR.AdminInasistenciaMacro);
        
        this.router.get('/admin/marcaciones-emp/micro', TokenValidation, GRAFICAS_CONTROLADOR.AdminMarcacionesEmpleadoMicro);
        this.router.get('/admin/marcaciones-emp/macro/:desde/:hasta', TokenValidation, GRAFICAS_CONTROLADOR.AdminMarcacionesEmpleadoMacro);
        
        // this.router.get('/inasistencia/micro', TokenValidation, GRAFICAS_CONTROLADOR.ObtenerInasistencia);
        // this.router.get('/inasistencia/micro', TokenValidation, GRAFICAS_CONTROLADOR.ObtenerInasistencia);
        // this.router.post('/insertar', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.AsignarRelojEnrolado);
        // this.router.post('/buscar', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.ObtenerIdReloj);
        // this.router.put('/', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.ActualizarRelojEnrolado);
        // this.router.delete('/eliminar/:id', TokenValidation, ENROLADO_RELOJ_CONTROLADOR.EliminarRelojEnrolado);
    }
}

const GRAFICAS_RUTAS = new GraficasRutas();

export default GRAFICAS_RUTAS.router;
