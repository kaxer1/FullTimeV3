import { Request, Response } from 'express';
import pool from '../../database';

class VacacionesControlador {

  public async ListarVacaciones(req: Request, res: Response) {
    const VACACIONES = await pool.query('SELECT *FROM vacaciones');
    if (VACACIONES.rowCount > 0) {
      return res.json(VACACIONES.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async CrearVacaciones(req: Request, res: Response): Promise<void> {
    const { fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion } = req.body;
    await pool.query('INSERT INTO vacaciones (fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion]);
    res.json({ message: 'Vacaciones guardadas con éxito' });
  }

}

export const VACACIONES_CONTROLADOR = new VacacionesControlador();

export default VACACIONES_CONTROLADOR;