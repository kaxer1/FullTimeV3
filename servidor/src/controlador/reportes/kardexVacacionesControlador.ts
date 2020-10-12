import { Request, Response } from 'express';
import { vacacionesByIdUser } from '../../libs/CalcularVacaciones';
import { CalcularHoraExtra } from '../../libs/CalcularHorasExtras';

class KardexVacacion {

    public async CarcularVacacionByIdToken(req: Request, res: Response) {
        // console.log(req.userIdEmpleado);
        // console.log(req.id_empresa)
        console.log(req.params.desde);
        console.log(req.params.hasta);
        
        // let fec_desde = new Date(req.params.desde)
        // let fec_hasta = new Date(req.params.hasta)
        let fec_desde = req.params.desde
        let fec_hasta = req.params.hasta
        let jsonData = await vacacionesByIdUser(req.userIdEmpleado, fec_desde, fec_hasta);
        res.jsonp(jsonData);
    } 

    public async CarcularVacacionByIdEmpleado(req: Request, res: Response) {
        let id_empleado = parseInt(req.params.id_empleado)
        // console.log(req.params.desde);
        // console.log(req.params.hasta);
        // console.log(id_empleado)
        
        // let fec_desde = new Date(req.params.desde)
        // let fec_hasta = new Date(req.params.hasta)
        let fec_desde = req.params.desde
        let fec_hasta = req.params.hasta
        let jsonData = await vacacionesByIdUser(id_empleado, fec_desde, fec_hasta);
        res.jsonp(jsonData);
    } 

    public async CarcularHorasExtras(req: Request, res: Response) {
        let id_empleado = parseInt(req.params.id_empleado)
        // console.log(req.params.desde);
        // console.log(req.params.hasta);
        // console.log(id_empleado)
        
        // let fec_desde = new Date(req.params.desde)
        // let fec_hasta = new Date(req.params.hasta)
        let fec_desde = req.params.desde
        let fec_hasta = req.params.hasta
        let jsonData = await CalcularHoraExtra(id_empleado, fec_desde, fec_hasta);
        res.jsonp(jsonData);
    }
}

export const KARDEX_VACACION_CONTROLADOR = new KardexVacacion();

export default KARDEX_VACACION_CONTROLADOR;