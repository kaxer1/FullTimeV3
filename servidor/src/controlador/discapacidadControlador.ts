import { Request, Response } from 'express';
import pool from '../database';

class DiscapacidadControlador {
  public async list(req: Request, res: Response) {
    const discapacidad = await pool.query('SELECT * FROM cg_discapacidades');
    res.json(discapacidad.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const unaDiscapacidad = await pool.query('SELECT * FROM cg_discapacidades WHERE id_empleado = $1', [id_empleado]);
    if (unaDiscapacidad.rowCount > 0) {
      return res.json(unaDiscapacidad.rows)
    }
    res.status(404).json({ text: 'Discapacidad no encontrada' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { id_empleado, carn_conadis, porcentaje, tipo } = req.body;
    await pool.query('INSERT INTO cg_discapacidades ( id_empleado, carn_conadis, porcentaje, tipo) VALUES ($1, $2, $3, $4)', [id_empleado, carn_conadis, porcentaje, tipo]);
    console.log(req.body);
    res.json({ message: 'Discapacidad guardada'});
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id_empleado} = req.params;
    const { carn_conadis, porcentaje, tipo } = req.body;
    await pool.query('UPDATE cg_discapacidades SET carn_conadis = $1, porcentaje = $2, tipo = $3 WHERE id_empleado = $4', [carn_conadis, porcentaje, tipo, id_empleado]);
    res.json({ message: 'Discapacidad actualizada exitosamente' });
  }

}

export const discapacidadControlador = new DiscapacidadControlador();

export default discapacidadControlador;