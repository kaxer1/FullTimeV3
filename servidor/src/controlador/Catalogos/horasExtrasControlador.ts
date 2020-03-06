import { Request, Response } from 'express';
import pool from '../../database';

class HorasExtrasControlador {
  public async list(req: Request, res: Response) {
    const horasExtras = await pool.query('SELECT * FROM cg_hora_extras');
    res.json(horasExtras.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const userHorasExtras = await pool.query('SELECT * FROM cg_hora_extras WHERE id = $1', [id]);
    if (userHorasExtras.rowCount > 0) {
      return res.json(userHorasExtras.rows)
    }
    res.status(404).json({ text: 'Hora estra no encontrada' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion} = req.body;
    await pool.query('INSERT INTO cg_hora_extras ( descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion]);
    console.log(req.body);
    res.json({ message: 'Hora extra guardada' });
  }

}

export const horaExtraControlador = new HorasExtrasControlador();

export default horaExtraControlador;