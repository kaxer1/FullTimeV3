import { Request, Response } from 'express';
import pool from '../database';

class EmpleadoControlador {
  public async list(req: Request, res: Response) {
    const empleado = await pool.query('SELECT * FROM empleado');
    //res.json({text: 'Describe prueba'});
    res.json(empleado.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const rol = await pool.query('SELECT * FROM empleado WHERE id = $1', [id]);
    // console.log(rol);
    if (rol.rowCount > 0) {
      return res.json(rol.rows[0])
    }
    //res.json({message: 'Rol encontrado'});
    //res.json({text: 'Esta es una prueba ' + req.params.id});
    res.status(404).json({ text: 'El rol no ha sido encontrado' });
  }

  // public async create(req: Request, res: Response): Promise<void> {
  //   const { cedula, apellido, nombre, estado_civil, 
  //     genero, correo, fecha_nacimiento, estado, 
  //     correo_alternativo, domicilio, telefono } = req.body;
  //   await pool.query('INSERT INTO empleado ( cedula, apellido, nombre, estado_civil, genero, correo, fecha_nacimiento, estado, correo_alternativo, domicilio, telefono) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [cedula, apellido, nombre, estado_civil, genero, correo, fecha_nacimiento, estado, correo_alternativo, domicilio, telefono]);
  //   console.log(req.body);
  //   res.json({ message: 'Empleado guardado' });
  // }

}

export const empleadoControlador = new EmpleadoControlador();

export default empleadoControlador;
