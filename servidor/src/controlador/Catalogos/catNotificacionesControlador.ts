import { Request, Response } from 'express';
import pool from '../../database';

class NotificacionesControlador {
  public async ListarNotificaciones(req: Request, res: Response) {
    const NOTIFICACIONES = await pool.query('SELECT cn.tipo, cn.nivel, cn.id, cd.nombre, ctp.descripcion, cd.id AS departamento, ctp.id AS tipo_permiso FROM cg_notificaciones AS cn, cg_departamentos AS cd, cg_tipo_permisos AS ctp WHERE cn.id_departamento = cd.id AND cn.id_tipo_permiso = ctp.id AND NOT cd.nombre = \'Ninguno\' ORDER BY cd.nombre ASC');
    if (NOTIFICACIONES.rowCount > 0) {
      return res.jsonp(NOTIFICACIONES.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnaNotificacion(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const NOTIFICACIONES = await pool.query('SELECT * FROM cg_notificaciones WHERE id = $1', [id]);
    if (NOTIFICACIONES.rowCount > 0) {
      return res.jsonp(NOTIFICACIONES.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearNotificacion(req: Request, res: Response) {
    try {
      const { tipo, nivel, id_departamento, id_tipo_permiso } = req.body;
      await pool.query('INSERT INTO cg_notificaciones ( tipo, nivel, id_departamento, id_tipo_permiso ) VALUES ($1, $2, $3, $4)', [tipo, nivel, id_departamento, id_tipo_permiso]);
      res.jsonp({ message: 'Notificación guardada' });
    }
    catch (error) {
      return res.jsonp({ message: 'error' });
    }

  }

  public async ObtenerNotificacionPermiso(req: Request, res: Response): Promise<any> {
    const { id_tipo_permiso } = req.params;
    const NOTIFICACIONES = await pool.query('SELECT * FROM cg_notificaciones WHERE id_tipo_permiso = $1', [id_tipo_permiso]);
    if (NOTIFICACIONES.rowCount > 0) {
      return res.jsonp(NOTIFICACIONES.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

}

const NOTIFICACIONES_CONTROLADOR = new NotificacionesControlador();

export default NOTIFICACIONES_CONTROLADOR;