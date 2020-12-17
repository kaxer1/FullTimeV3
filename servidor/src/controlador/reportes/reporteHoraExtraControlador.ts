import { Request, Response } from 'express'
import { CalcularHoraExtra } from '../../libs/CalcularHorasExtras';
// import { ContarHorasByCargo } from '../../libs/ContarHoras'
// import { Consultar } from '../../libs/ListaEmpleados'
class ReporteHoraExtraControlador {

    public async ReporteHorasExtras(req: Request, res: Response) {

        var {id_empleado, desde, hasta} = req.params
        
        let resultado = await CalcularHoraExtra(parseInt(id_empleado), new Date(desde), new Date(hasta));
        
        if (resultado.message) {
            return res.status(400).jsonp(resultado)
        }
        return res.status(200).jsonp(resultado)
    }

}

const REPORTE_HORA_EXTRA_CONTROLADOR = new ReporteHoraExtraControlador();
export default REPORTE_HORA_EXTRA_CONTROLADOR  