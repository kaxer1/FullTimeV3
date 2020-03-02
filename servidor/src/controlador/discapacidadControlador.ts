import { Request, Response } from 'express';
import pool from '../database';

class DiscapacidadControlador {
  public async list(req: Request, res: Response) {
    const discapacidad = await pool.query('SELECT * FROM discapacidad');
    res.json(discapacidad.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unaDiscapacidad = await pool.query('SELECT * FROM discapacidad WHERE id = $1', [id]);
    if (unaDiscapacidad.rowCount > 0) {
      return res.json(unaDiscapacidad.rows[0])
    }
    res.status(404).json({ text: 'Discapacidad no encontrada' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { id_empleado, carnet_conadis, porcentaje, tipo } = req.body;
    await pool.query('INSERT INTO discapacidad ( id_empleado, carnet_conadis, porcentaje, tipo) VALUES ($1, $2, $3, $4)', [id_empleado, carnet_conadis, porcentaje, tipo]);
    console.log(req.body);
    res.json({ message: 'Discapacidad guardada' });
  }

}

export const discapacidadControlador = new DiscapacidadControlador();

export default discapacidadControlador;