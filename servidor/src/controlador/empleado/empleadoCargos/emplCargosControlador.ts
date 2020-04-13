import { Request, Response } from 'express';
import pool from '../../../database';

class EmpleadoCargosControlador {
  public async list(req: Request, res: Response) {
    const empleadoCargos = await pool.query('SELECT * FROM empl_cargos');
    res.json(empleadoCargos.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unEmplCargp = await pool.query('SELECT * FROM empl_cargos WHERE id = $1', [id]);
    if (unEmplCargp.rowCount > 0) {
      return res.json(unEmplCargp.rows)
    }
    res.status(404).json({ text: 'Cargo del empleado no encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja } = req.body;
    await pool.query('INSERT INTO empl_cargos ( id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja]);
    console.log(req.body);
    res.json({ message: 'Cargo empleado guardado'});
  }

}

export const EMPLEADO_CARGO_CONTROLADOR = new EmpleadoCargosControlador();

export default EMPLEADO_CARGO_CONTROLADOR;