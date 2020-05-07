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

  public async EncontrarProcesoPorIdCargo(req: Request, res: Response): Promise<any> {
    const { id_empl_cargo } = req.params;
    const HORARIO_CARGO = await pool.query('SELECT ep.id, ep.id_empl_cargo, ep.fec_inicio, ep.fec_final, cp.nombre AS proceso FROM empl_procesos AS ep, cg_procesos AS cp WHERE ep.id_empl_cargo = $1 AND ep.id = cp.id', [id_empl_cargo]);
    if (HORARIO_CARGO.rowCount > 0) {
      return res.json(HORARIO_CARGO.rows)
    }
    res.status(404).json({ text: 'Registro no encontrado' });
  }


}

export const EMPLEADO_PROCESO_CONTROLADOR = new EmpleadoProcesoControlador();

export default EMPLEADO_PROCESO_CONTROLADOR;