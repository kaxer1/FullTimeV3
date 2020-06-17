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

    public async ObtenerAutorizacionPorIdDocumento(req: Request, res: Response) {
        const id = req.params.id_documento
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones WHERE id_documento = $1', [id]);
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

    public async ActualizarEstado(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const { estado } = req.body;
        await pool.query('UPDATE autorizaciones SET estado = $1 WHERE id = $2', [estado, id]);
        res.json({ message: 'Estado de permiso actualizado exitosamente' });
    }
}

export const AUTORIZACION_CONTROLADOR = new AutorizacionesControlador();

export default AUTORIZACION_CONTROLADOR;