import { Request, Response } from 'express';
import pool from '../../../database';

class EmpleadoControlador {
  public async list(req: Request, res: Response) {
    const empleado = await pool.query('SELECT * FROM empleados');
    res.json(empleado.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unEmpleado = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
    if (unEmpleado.rowCount > 0) {
      return res.json(unEmpleado.rows)
    }
    res.status(404).json({ text: 'El empleado no ha sido encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad} = req.body;
    await pool.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad]);
    console.log(req.body);
    // const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad } = req.body;
    // await pool.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad]);
    const oneEmpley = await pool.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
    const idEmployGuardado = oneEmpley.rows[0].id;
    res.json({ message: 'Empleado guardado', id: idEmployGuardado});
  }

  public async createEmpleadoTitulos(req: Request, res: Response): Promise<void> {
    const { observacion, id_empleado, id_titulo } = req.body;
    await pool.query('INSERT INTO empl_titulos ( observacion, id_empleado, id_titulo ) VALUES ($1, $2, $3)', [observacion, id_empleado, id_titulo]);
    console.log(req.body);
    res.json({ message: 'Titulo del empleado Guardado'});
  }

  public async getTitulosDelEmpleado(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const unEmpleadoTitulo = await pool.query('SELECT * FROM empl_titulos WHERE id_empleado = $1', [id_empleado]);
    if (unEmpleadoTitulo.rowCount > 0) {
      return res.json(unEmpleadoTitulo.rows)
    }
    res.status(404).json({ text: 'El empleado no tiene titulos asignados' });
  }
}

export const EMPLEADO_CONTROLADOR = new EmpleadoControlador();

export default EMPLEADO_CONTROLADOR;
