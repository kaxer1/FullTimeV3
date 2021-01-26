import { Request, Response } from 'express';
import pool from '../../database';

class PlanComidasControlador {

  public async ListarPlanComidas(req: Request, res: Response) {
    const PLAN_COMIDAS = await pool.query('SELECT * FROM plan_comidas');
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearPlanComidas(req: Request, res: Response): Promise<void> {
    const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, descripcion,
      tipo_comida, extra } = req.body;
    await pool.query('INSERT INTO plan_comidas (id_empleado, fecha, id_comida, observacion, fec_solicita, ' +
      'hora_inicio, hora_fin, descripcion, tipo_comida, extra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin,
        descripcion, tipo_comida, extra]);
    res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
  }

  public async EncontrarPlanComidaPorIdEmpleado(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const PLAN_COMIDAS = await pool.query('SELECT pc.id, pc.id_empleado, pc.fecha, pc.observacion, ' +
      'pc.fec_solicita, pc.hora_inicio, pc.hora_fin, pc.descripcion, ct.id AS id_tipo_comida, ct.nombre, ' +
      'ct.valor, s.nombre AS tipo_servicio, s.id AS id_servicio, pc.extra FROM plan_comidas AS pc, cg_tipo_comidas AS ct, tipo_comida AS s ' +
      'WHERE pc.id_empleado = $1 AND ' +
      'pc.id_comida = ct.id AND s.id = pc.tipo_comida', [id_empleado]);
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    res.status(404).jsonp({ text: 'Registro no encontrado' });
  }

  public async EliminarRegistros(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await pool.query('DELETE FROM plan_comidas WHERE id = $1', [id]);
    res.jsonp({ message: 'Registro eliminado' });
  }

  public async ActualizarPlanComidas(req: Request, res: Response): Promise<void> {
    const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, tipo_comida,
      extra, id } = req.body;
    await pool.query('UPDATE plan_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, ' +
      'observacion = $4, fec_solicita = $5, hora_inicio = $6, hora_fin = $7, tipo_comida = $8, extra = $9 ' +
      'WHERE id = $10',
      [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, tipo_comida, extra, id]);
    res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
  }

  /** TABLA TIPO COMIDAS */
  public async ListarTipoComidas(req: Request, res: Response) {
    const PLAN_COMIDAS = await pool.query('SELECT * FROM tipo_comida');
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearTipoComidas(req: Request, res: Response): Promise<void> {
    const { nombre } = req.body;
    await pool.query('INSERT INTO tipo_comida (nombre) VALUES ($1)',
      [nombre]);
    res.jsonp({ message: 'Tipo comida ha sido guardado con éxito' });
  }

  public async VerUltimoTipoComidas(req: Request, res: Response) {
    const PLAN_COMIDAS = await pool.query('SELECT MAX(id) FROM tipo_comida');
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

}

export const PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();

export default PLAN_COMIDAS_CONTROLADOR;