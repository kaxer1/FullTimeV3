import { Request, Response } from 'express';
import { GraficaAsistencia, GraficaHorasExtras, GraficaInasistencia, GraficaJornada_VS_HorasExtras, 
    GraficaMarcaciones, GraficaTiempoJornada_VS_HorasExtras, MetricaHorasExtraEmpleado,
    MetricaPermisosEmpleado, MetricaVacacionesEmpleado,MetricaAtrasosEmpleado,GraficaSalidasAnticipadas, GraficaAtrasos } from '../../libs/MetodosGraficas';

class GraficasControlador {

    public async AdminHorasExtrasMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaHorasExtras(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminHorasExtrasMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa

        let resultado = await GraficaHorasExtras(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }
   
    public async AdminAtrasosMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaAtrasos(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminAtrasosMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa;

        let resultado = await GraficaAtrasos(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }
    
    public async AdminAsistenciaMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaAsistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminAsistenciaMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa

        let resultado = await GraficaAsistencia(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }
   
    public async AdminJornadaHorasExtrasMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaJornada_VS_HorasExtras(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminJornadaHorasExtrasMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa;

        let resultado = await GraficaJornada_VS_HorasExtras(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }
   
    public async AdminTiempoJornadaHorasExtrasMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaTiempoJornada_VS_HorasExtras(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminTiempoJornadaHorasExtrasMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa;

        let resultado = await GraficaTiempoJornada_VS_HorasExtras(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }

    public async AdminInasistenciaMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminInasistenciaMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa;

        let resultado = await GraficaInasistencia(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }
    
    public async AdminMarcacionesEmpleadoMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaMarcaciones(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminMarcacionesEmpleadoMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa;

        let resultado = await GraficaMarcaciones(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }

    public async AdminSalidasAnticipadasMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await GraficaSalidasAnticipadas(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async AdminSalidasAnticipadasMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa;

        let resultado = await GraficaSalidasAnticipadas(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }

    /**
     * 
     * METODOS DE GRAFICAS PARA LOS EMPLEADOS
     * 
     */

    public async EmpleadoHorasExtrasMicro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await MetricaHorasExtraEmpleado(id_empleado, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }
    
    public async EmpleadoHorasExtrasMacro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        
        let resultado = await MetricaHorasExtraEmpleado(id_empleado, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }

    public async EmpleadoVacacionesMicro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await MetricaVacacionesEmpleado(id_empleado, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }

    public async EmpleadoVacacionesMacro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        
        let resultado = await MetricaVacacionesEmpleado(id_empleado, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }

    public async EmpleadoPermisosMicro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await MetricaPermisosEmpleado(id_empleado, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }

    public async EmpleadoPermisosMacro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        
        let resultado = await MetricaPermisosEmpleado(id_empleado, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }

    public async EmpleadoAtrasosMicro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        let resultado = await MetricaAtrasosEmpleado(id_empleado, fec_inicio, fec_final)
        res.status(200).jsonp(resultado);
    }

    public async EmpleadoAtrasosMacro(req: Request, res: Response): Promise<void> {
        const id_empleado = req.userIdEmpleado;
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        
        let resultado = await MetricaAtrasosEmpleado(id_empleado, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }

}

export const GRAFICAS_CONTROLADOR = new GraficasControlador();

export default GRAFICAS_CONTROLADOR;