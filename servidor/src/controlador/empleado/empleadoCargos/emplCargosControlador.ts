import { Request, Response } from 'express';
import pool from '../../../database';

class EmpleadoCargosControlador {
  public async list(req: Request, res: Response) {
    const empleadoCargos = await pool.query('SELECT * FROM empl_cargos');
    res.jsonp(empleadoCargos.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unEmplCargp = await pool.query('SELECT ec.id, ec.id_empl_contrato, ec.id_departamento, ec.fec_inicio, ec.fec_final, ec.id_sucursal, ec.sueldo, ec.hora_trabaja, s.id_empresa FROM empl_cargos AS ec, sucursales AS s WHERE ec.id = $1 AND s.id = ec.id_sucursal', [id]);
    if (unEmplCargp.rowCount > 0) {
      return res.jsonp(unEmplCargp.rows)
    }
    res.status(404).jsonp({ text: 'Cargo del empleado no encontrado' });
  }

  public async Crear(req: Request, res: Response): Promise<void> {
    const { id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja } = req.body;
    await pool.query('INSERT INTO empl_cargos ( id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja]);
    console.log(req.body);
    res.jsonp({ message: 'Cargo empleado guardado' });
  }

  public async EncontrarIdCargo(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const CARGO = await pool.query('SELECT ec.id FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id_empleado]);
    if (CARGO.rowCount > 0) {
      return res.jsonp(CARGO.rows)
    }
    else {
      res.status(404).jsonp({ text: 'Registro no encontrado' });
    }
  }

  public async EncontrarIdCargoActual(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const CARGO = await pool.query('SELECT MAX(e_cargo.id) FROM empl_cargos AS e_cargo, empl_contratos AS contrato_e, empleados AS e WHERE contrato_e.id_empleado = e.id AND e_cargo.id_empl_contrato = contrato_e.id AND e.id = $1', [id_empleado]);
    if (CARGO.rowCount > 0) {
      console.log("Patricia id cargo", CARGO.rows);
      if(CARGO.rows[0]['max'] != null){
        return res.jsonp(CARGO.rows)
      }
      else {
        res.status(404).jsonp({ text: 'Registro no encontrado' });
      }
     
    }
    else {
      res.status(404).jsonp({ text: 'Registro no encontrado' });
    }
  }

  public async EncontrarInfoCargoEmpleado(req: Request, res: Response): Promise<any> {
    const { id_empl_contrato } = req.params;
    const unEmplCargp = await pool.query('SELECT ec.id, ec.fec_inicio, ec.fec_final, ec.sueldo, ec.hora_trabaja, s.nombre AS sucursal, d.nombre AS departamento FROM empl_cargos AS ec, sucursales AS s, cg_departamentos AS d WHERE ec.id_empl_contrato = $1 AND ec.id_sucursal = s.id AND ec.id_departamento = d.id', [id_empl_contrato]);
    if (unEmplCargp.rowCount > 0) {
      return res.jsonp(unEmplCargp.rows)
    }
    res.status(404).jsonp({ text: 'Cargo del empleado no encontrado' });
  }
  
  public async EditarCargo(req: Request, res: Response): Promise<any> {
    const { id_empl_contrato, id } = req.params;
    const { id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja } = req.body;
    
    await pool.query('UPDATE empl_cargos SET id_departamento = $1, fec_inicio = $2, fec_final = $3, id_sucursal = $4, sueldo = $5, hora_trabaja = $6  WHERE id_empl_contrato = $7 AND id = $8', [id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja, id_empl_contrato, id]);
    res.jsonp({ message: 'Cargo del empleado actualizado exitosamente' });
}

}

export const EMPLEADO_CARGO_CONTROLADOR = new EmpleadoCargosControlador();

export default EMPLEADO_CARGO_CONTROLADOR;