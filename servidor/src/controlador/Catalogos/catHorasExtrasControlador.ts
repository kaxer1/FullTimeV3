import { Request, Response } from 'express'
import pool from '../../database';

class HorasExtrasControlador {
  public async ListarHorasExtras(req: Request, res: Response) {
    const HORAS_EXTRAS = await pool.query('SELECT * FROM cg_hora_extras');
    if (HORAS_EXTRAS.rowCount > 0) {
      return res.jsonp(HORAS_EXTRAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnaHoraExtra(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const HORAS_EXTRAS = await pool.query('SELECT * FROM cg_hora_extras WHERE id = $1', [id]);
    if (HORAS_EXTRAS.rowCount > 0) {
      return res.jsonp(HORAS_EXTRAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearHoraExtra(req: Request, res: Response): Promise<void> {
    const { descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion} = req.body;
    await pool.query('INSERT INTO cg_hora_extras ( descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion]);
    res.jsonp({ message: 'Hora extra guardada' });
  }

}

export const horaExtraControlador = new HorasExtrasControlador();

export default horaExtraControlador;