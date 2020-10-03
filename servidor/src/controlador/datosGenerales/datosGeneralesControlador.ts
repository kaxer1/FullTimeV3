import { Request, Response } from 'express';
import pool from '../../database';

class DatosGeneralesControlador {

    public async ListarDatosEmpleadoAutoriza(req: Request, res: Response) {
        const { empleado_id } = req.params;
        const DATOS = await pool.query('SELECT * FROM datosCargoActual ($1)', [empleado_id]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

}

const DATOS_GENERALES_CONTROLADOR = new DatosGeneralesControlador();

export default DATOS_GENERALES_CONTROLADOR;


