import { Request, Response } from 'express';
import pool from '../../database';

class NotificacionesControlador {
  public async list(req: Request, res: Response) {
    const notificacion = await pool.query('SELECT * FROM cg_notificaciones');
    res.json(notificacion.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unaNotificacion = await pool.query('SELECT * FROM cg_notificaciones WHERE id = $1', [id]);
    if (unaNotificacion.rowCount > 0) {
      return res.json(unaNotificacion.rows)
    }
    res.status(404).json({ text: 'Notificacion no encontrada' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { tipo, nivel, id_departamento, id_tipo_permiso } = req.body;
    await pool.query('INSERT INTO cg_notificaciones ( tipo, nivel, id_departamento, id_tipo_permiso ) VALUES ($1, $2, $3, $4)', [tipo, nivel, id_departamento, id_tipo_permiso]);
    console.log(req.body);
    res.json({ message: 'Notificacion guardada' });
  }

}

export const notificacionesControlador = new NotificacionesControlador();

export default notificacionesControlador;