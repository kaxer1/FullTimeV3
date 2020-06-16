import { Request, Response } from 'express';
import pool from '../../database';

class AutorizacionesControlador {

    public async ListarAutorizaciones(req: Request, res: Response) {
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones ORDER BY id');
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnaAutorizacion(req: Request, res: Response) {
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones');
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES .rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearAutorizacion(req: Request, res: Response): Promise<any> {
        const { id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento} = req.body;
        await pool.query('INSERT INTO autorizaciones ( id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento]);
        res.jsonp({ message: 'Autorizacion guardado'});
    }

}

export const AUTORIZACION_CONTROLADOR = new AutorizacionesControlador();

export default AUTORIZACION_CONTROLADOR;