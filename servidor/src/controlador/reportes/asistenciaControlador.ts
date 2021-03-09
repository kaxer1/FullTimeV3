import { Request, Response } from 'express'
import pool from '../../database';
import { ContarHorasByCargo } from '../../libs/ContarHoras'
import { Consultar } from '../../libs/ListaEmpleados'
class AsistenciaControlador {

    public async ObtenerHorasTrabajadas(req: Request, res: Response) {

        var {id_empleado, desde, hasta} = req.params
        
        let resultado = await ContarHorasByCargo(parseInt(id_empleado), new Date(desde), new Date(hasta));
        
        if (resultado.message) return res.status(404).jsonp(resultado)
        
        res.status(200).jsonp(resultado)
    }

    public async ObtenerListaEmpresa(req:Request, res: Response) {
        var {id_empresa} = req.params

        let c = await Consultar(parseInt(id_empresa));

        res.jsonp(c)
    }

}

const ASISTENCIA_CONTROLADOR = new AsistenciaControlador();
export default ASISTENCIA_CONTROLADOR  