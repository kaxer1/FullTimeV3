import { Request, Response } from 'express';
import pool from '../../database';

class VacacionesControlador {

  public async ListarVacaciones(req: Request, res: Response) {
    const VACACIONES = await pool.query('SELECT *FROM vacaciones');
    if (VACACIONES.rowCount > 0) {
      return res.jsonp(VACACIONES.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearVacaciones(req: Request, res: Response): Promise<void> {
    const { fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion } = req.body;
    await pool.query('INSERT INTO vacaciones (fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion]);
    res.jsonp({ message: 'Vacaciones guardadas con éxito' });
  }

  public async VacacionesIdPeriodo(req: Request, res: Response) {
    const { id } = req.params;
    const VACACIONES = await pool.query('SELECT v.fec_inicio, v.fec_final, fec_ingreso, v.estado, v.dia_libre, v.dia_laborable, v.legalizado, v.id, v.id_peri_vacacion FROM vacaciones AS v, peri_vacaciones AS p WHERE v.id_peri_vacacion = p.id AND p.id = $1', [id]);
    if (VACACIONES.rowCount > 0) {
      return res.jsonp(VACACIONES.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerFechasFeriado(req: Request, res: Response): Promise<any> {
    const { fechaSalida, fechaIngreso } = req.body;
    const FECHAS = await pool.query('SELECT fecha FROM cg_feriados WHERE fecha BETWEEN $1 AND $2 ORDER BY fecha ASC', [fechaSalida, fechaIngreso]);
    if (FECHAS.rowCount > 0) {
      return res.jsonp(FECHAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'Registros no encontrados' });
    }
  }

}

export const VACACIONES_CONTROLADOR = new VacacionesControlador();

export default VACACIONES_CONTROLADOR;