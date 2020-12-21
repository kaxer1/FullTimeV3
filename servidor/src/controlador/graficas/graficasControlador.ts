import { Request, Response } from 'express';
import pool from '../../database';
import { GraficaInasistencia } from '../../libs/MetodosGraficas';

class GraficasControlador {

    public async AdminHorasExtrasMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp({message: 'Horas Extras micro'});
    }
    
    public async AdminHorasExtrasMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa
        res.status(200).jsonp({message: 'Horas Extras macro'});
    }
   
    public async AdminRetrasosMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp({message: 'Retrasos micro'});
    }
    
    public async AdminRetrasosMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa
        res.status(200).jsonp({message: 'Retrasos macro'});
    }
    
    public async AdminAsistenciaMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp({message: 'Asistencia micro'});
    }
    
    public async AdminAsistenciaMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa
        res.status(200).jsonp({message: 'Asistencia macro'});
    }
   
    public async AdminJornadaHorasExtrasMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp({message: 'Jornada vs Horas Extras micro'});
    }
    
    public async AdminJornadaHorasExtrasMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa
        res.status(200).jsonp({message: 'Jornada vs Horas Extras macro'});
    }
   
    public async AdminTiempoJornadaHorasExtrasMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp({message: 'Tiempo de jornada vs Horas Extras micro'});
    }
    
    public async AdminTiempoJornadaHorasExtrasMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa
        res.status(200).jsonp({message: 'Tiempo de jornada vs Horas Extras macro'});
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
        const id_empresa = req.id_empresa
        let resultado = await GraficaInasistencia(id_empresa, new Date(fec_inicio), new Date(fec_final))
        res.status(200).jsonp(resultado);
    }
    
    public async AdminMarcacionesEmpleadoMicro(req: Request, res: Response): Promise<void> {
        const id_empresa = req.id_empresa;
        const fec_final = new Date();
        var fec_inicio = new Date();
        fec_inicio.setUTCDate(1); fec_inicio.setUTCMonth(0); fec_inicio.setUTCHours(0); fec_inicio.setUTCMinutes(0); fec_inicio.setUTCSeconds(0)
        fec_final.setUTCHours(0); fec_final.setUTCMinutes(0); fec_final.setUTCSeconds(0);

        // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
        res.status(200).jsonp({message: 'Maraciones empleado micro'});
    }
    
    public async AdminMarcacionesEmpleadoMacro(req: Request, res: Response): Promise<void> {
        const fec_inicio = req.params.desde;
        const fec_final = req.params.hasta;
        const id_empresa = req.id_empresa
        res.status(200).jsonp({message: 'Maraciones empleado macro'});
    }

}

export const GRAFICAS_CONTROLADOR = new GraficasControlador();

export default GRAFICAS_CONTROLADOR;