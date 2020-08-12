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
    const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin } = req.body;
    await pool.query('INSERT INTO plan_comidas (id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin]);
    res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
  }

  public async EncontrarPlanComidaPorIdEmpleado(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const PLAN_COMIDAS = await pool.query('SELECT pc.id, pc.id_empleado, pc.fecha, pc.observacion, pc.fec_solicita, pc.hora_inicio, pc.hora_fin, ct.id AS id_tipo_comida, ct.nombre, ct.valor FROM plan_comidas AS pc, cg_tipo_comidas AS ct WHERE pc.id_empleado = $1 AND pc.id_comida = ct.id', [id_empleado]);
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
    const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, id } = req.body;
    await pool.query('UPDATE plan_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, observacion = $4, fec_solicita = $5, hora_inicio = $6, hora_fin = $7 WHERE id = $8', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, id]);
    res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
  }

}

export const PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();

export default PLAN_COMIDAS_CONTROLADOR;