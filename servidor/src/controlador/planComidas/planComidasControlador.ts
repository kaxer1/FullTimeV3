import { Request, Response } from 'express';
import pool from '../../database';

class PlanComidasControlador {

  public async ListarPlanComidas(req: Request, res: Response) {
    const PLAN_COMIDAS = await pool.query('SELECT * FROM plan_comidas');
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.json(PLAN_COMIDAS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async CrearPlanComidas(req: Request, res: Response): Promise<void> {
    const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin } = req.body;
    await pool.query('INSERT INTO plan_comidas (id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin]);
    res.json({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
  }

}

export const PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();

export default PLAN_COMIDAS_CONTROLADOR ;