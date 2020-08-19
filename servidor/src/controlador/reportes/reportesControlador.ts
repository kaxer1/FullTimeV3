import { Request, Response } from 'express';
import pool from '../../database';

class ReportesControlador {

    public async ListarDatosContractoA(req: Request, res: Response) {
        const DATOS = await pool.query('SELECT * FROM datos_contrato_actual');
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarDatosCargoA(req: Request, res: Response) {
        const { empleado_id } = req.params;
        const DATOS = await pool.query('SELECT * FROM datosCargoActual ($1)', [empleado_id]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

}

export const REPORTES_CONTROLADOR = new ReportesControlador();

export default REPORTES_CONTROLADOR;