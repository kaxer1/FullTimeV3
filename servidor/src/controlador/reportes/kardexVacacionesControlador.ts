import {Request, Response} from 'express';
import {vacacionesByIdUser} from '../../libs/CalcularVacaciones'
class KardexVacacion {

    public async CarcularVacacionByIdToken(req: Request, res: Response) {
        // console.log(req.userIdEmpleado);
        // console.log(req.id_empresa)
        let jsonData = await vacacionesByIdUser(req.userIdEmpleado);
        res.jsonp(jsonData);
    } 

    public async CarcularVacacionByIdEmpleado(req: Request, res: Response) {
        let id_empleado = parseInt(req.params.id_empleado)
        console.log(id_empleado)
        let jsonData = await vacacionesByIdUser(id_empleado);
        res.jsonp(jsonData);
    } 


}

export const KARDEX_VACACION_CONTROLADOR = new KardexVacacion();

export default KARDEX_VACACION_CONTROLADOR;