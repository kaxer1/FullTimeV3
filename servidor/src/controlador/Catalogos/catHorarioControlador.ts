import { Request, Response } from 'express';
import pool from '../../database';

class HorarioControlador {

  public async ListarHorarios(req: Request, res: Response) {
    const HORARIOS = await pool.query('SELECT * FROM cg_horarios ORDER BY nombre ASC');
    if (HORARIOS.rowCount > 0) {
      return res.json(HORARIOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnHorario(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const UN_HORARIO = await pool.query('SELECT * FROM cg_horarios WHERE id = $1', [id]);
    if (UN_HORARIO.rowCount > 0) {
      return res.json(UN_HORARIO.rows)
    }
    else {
      res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async CrearHorario(req: Request, res: Response): Promise<void> {
    //HORA_TRABAJO --SOLO PERMITE 2 Números 1 entero, un decimal 
    const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas } = req.body;
    await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo,flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas]);
    res.json({ message: 'El horario ha sido registrado' });
  }

}

export const HORARIO_CONTROLADOR = new HorarioControlador();

export default HORARIO_CONTROLADOR;