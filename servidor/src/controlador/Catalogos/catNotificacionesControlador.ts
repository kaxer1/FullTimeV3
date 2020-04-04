import { Request, Response } from 'express';
import pool from '../../database';

class NotificacionesControlador {
  public async ListarNotificaciones(req: Request, res: Response) {
    const NOTIFICACIONES = await pool.query('SELECT * FROM cg_notificaciones');
    if (NOTIFICACIONES.rowCount > 0) {
      return res.json(NOTIFICACIONES.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnaNotificacion(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const NOTIFICACIONES = await pool.query('SELECT * FROM cg_notificaciones WHERE id = $1', [id]);
    if (NOTIFICACIONES.rowCount > 0) {
      return res.json(NOTIFICACIONES.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async CrearNotificacion(req: Request, res: Response): Promise<void> {
    const { tipo, nivel, id_departamento, id_tipo_permiso } = req.body;
    await pool.query('INSERT INTO cg_notificaciones ( tipo, nivel, id_departamento, id_tipo_permiso ) VALUES ($1, $2, $3, $4)', [tipo, nivel, id_departamento, id_tipo_permiso]);
    res.json({ message: 'Notificación guardada' });
  }

}

const NOTIFICACIONES_CONTROLADOR = new NotificacionesControlador();

export default NOTIFICACIONES_CONTROLADOR;