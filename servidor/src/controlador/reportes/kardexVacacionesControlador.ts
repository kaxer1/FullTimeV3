import {Request, Response} from 'express';
import {vacacionesByIdUser} from '../../libs/CalcularVacaciones'
class KardexVacacion {

    public async varcularVacacion(req: Request, res: Response) {
        // console.log(req.userIdEmpleado);
        // console.log(req.id_empresa)
        
        let jsonData = await vacacionesByIdUser(req.userIdEmpleado);
        
        res.jsonp(jsonData);
    } 

}

export const KARDEX_VACACION_CONTROLADOR = new KardexVacacion();

export default KARDEX_VACACION_CONTROLADOR;