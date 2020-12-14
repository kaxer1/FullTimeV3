import { Request, Response } from 'express'
import { CalcularHoraExtra } from '../../libs/CalcularHorasExtras';
// import { ContarHorasByCargo } from '../../libs/ContarHoras'
// import { Consultar } from '../../libs/ListaEmpleados'
class ReporteHoraExtraControlador {

    public async ReporteHorasExtras(req: Request, res: Response) {

        var {id_empleado, desde, hasta} = req.params
        
        let resultado = await CalcularHoraExtra(parseInt(id_empleado), new Date(desde), new Date(hasta));
        
        res.jsonp(resultado)
    }

}

const REPORTE_HORA_EXTRA_CONTROLADOR = new ReporteHoraExtraControlador();
export default REPORTE_HORA_EXTRA_CONTROLADOR  