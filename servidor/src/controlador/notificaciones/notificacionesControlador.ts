import { Request, Response } from 'express';
import pool from '../../database';

class NotificacionTiempoRealControlador {

  public async ListarNotificacion(req: Request, res: Response) {
    const REAL_TIME_NOTIFICACION = await pool.query('SELECT * FROM realtime_noti ORDER BY id DESC');
    res.jsonp(REAL_TIME_NOTIFICACION.rows);
  }

  public async ListaPorEmpleado(req: Request, res: Response): Promise<any> {
    const id = req.params.id_send;
    const REAL_TIME_NOTIFICACION = await pool.query('SELECT * FROM realtime_noti WHERE id_send_empl = $1 ORDER BY id DESC', [id]);
    if (REAL_TIME_NOTIFICACION.rowCount > 0) {
      return res.jsonp(REAL_TIME_NOTIFICACION.rows)
    }
    res.status(404).jsonp({ text: 'Registro no encontrado' });
  }

  public async ListaPorJefe(req: Request, res: Response): Promise<any> {
    const  id  = req.params.id_receive;
    const REAL_TIME_NOTIFICACION = await pool.query('SELECT r.id, r.id_send_empl, r.id_receives_empl, r.id_receives_depa, r.estado, r.create_at, r.id_permiso, r.visto, e.nombre, e.apellido, p.descripcion FROM realtime_noti AS r, empleados AS e, permisos AS p WHERE r.id_receives_empl = $1 AND e.id = r.id_send_empl AND p.id = r.id_permiso ORDER BY id DESC LIMIT 5', [id]);
    if (REAL_TIME_NOTIFICACION.rowCount > 0) {
      return res.jsonp(REAL_TIME_NOTIFICACION.rows)
    }
    res.status(404).jsonp({ text: 'Registro no encontrado' });
  }

  public async ObtenerUnaNotificacion(req: Request, res: Response): Promise<any> {
    const  id  = req.params.id;    
    const REAL_TIME_NOTIFICACION = await pool.query('SELECT r.id, r.id_send_empl, r.id_receives_empl, r.id_receives_depa, r.estado, r.create_at, r.id_permiso, r.visto, e.nombre, e.apellido, p.descripcion FROM realtime_noti AS r, empleados AS e, permisos AS p WHERE r.id = $1 AND e.id = r.id_send_empl AND p.id = r.id_permiso', [id]);
    if (REAL_TIME_NOTIFICACION.rowCount > 0) {
      return res.jsonp(REAL_TIME_NOTIFICACION.rows)
    }
    res.status(404).jsonp({ text: 'Registro no encontrado' });
  }


  public async create(req: Request, res: Response): Promise<void> {
    const { id_send_empl, id_receives_empl, id_receives_depa, estado, create_at, id_permiso } = req.body;
    await pool.query('INSERT INTO realtime_noti ( id_send_empl, id_receives_empl, id_receives_depa, estado, create_at, id_permiso ) VALUES ($1, $2, $3, $4, $5, $6)', [id_send_empl, id_receives_empl, id_receives_depa, estado, create_at, id_permiso]);
    const REAL_TIME_NOTIFICACION = await pool.query('SELECT id FROM realtime_noti WHERE create_at = $1 AND id_permiso = $2', [create_at, id_permiso]);
    
    res.jsonp({ message: 'Notificacion guardada', _id: REAL_TIME_NOTIFICACION.rows[0].id });
  }
  
  public async ActualizarVista(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const {visto} = req.body;
    await pool.query('UPDATE realtime_noti SET visto = $1 WHERE id = $2', [visto, id]);
    
    res.jsonp({ message: 'Vista modificado'});
  }


}

export const NOTIFICACION_TIEMPO_REAL_CONTROLADOR = new NotificacionTiempoRealControlador();

export default NOTIFICACION_TIEMPO_REAL_CONTROLADOR;