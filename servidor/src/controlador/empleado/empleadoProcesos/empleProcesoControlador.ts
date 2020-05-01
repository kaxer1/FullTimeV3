import { Request, Response } from 'express';
import pool from '../../../database';

class EmpleadoProcesoControlador {

  public async ListarEmpleProcesos(req: Request, res: Response) {
    const PROCESOS = await pool.query('SELECT *FROM empl_procesos');
    if (PROCESOS.rowCount > 0) {
      return res.json(PROCESOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async CrearEmpleProcesos(req: Request, res: Response): Promise<void> {
    const { id_empl_cargo, fec_inicio, fec_final } = req.body;
    await pool.query('INSERT INTO empl_procesos (id_empl_cargo, fec_inicio, fec_final) VALUES ($1, $2, $3)', [id_empl_cargo, fec_inicio, fec_final]);
    res.json({ message: 'Procesos del empleado guardados con éxito' });
  }

}

export const EMPLEADO_PROCESO_CONTROLADOR = new EmpleadoProcesoControlador();

export default EMPLEADO_PROCESO_CONTROLADOR;