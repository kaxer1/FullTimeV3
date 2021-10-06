import { Request, Response } from 'express';
import pool from '../../database';

class AuditoriaControlador {

    public async BuscarDatosAuditoria(req: Request, res: Response) {
        const { tabla, desde, hasta } = req.body
        const DATOS = await pool.query('SELECT schema_name, table_name, user_name, action_tstamp, ' +
            'action, original_data, new_data, query, ip FROM audit.logged_actions WHERE table_name = $1 ' +
            'AND action_tstamp::date BETWEEN $2 AND $3 ORDER BY action_tstamp::date DESC',
            [tabla, desde, hasta]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

}

export const AUDITORIA_CONTROLADOR = new AuditoriaControlador();

export default AUDITORIA_CONTROLADOR;