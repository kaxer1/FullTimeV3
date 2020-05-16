import { Request, Response } from 'express';
import pool from '../../../database';
import fs from 'fs';
const path = require("path");

class EmpleadoControlador {

  public async list(req: Request, res: Response) {
    const empleado = await pool.query('SELECT * FROM empleados ORDER BY id');
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

  public async getImagen(req: Request, res: Response): Promise<any> {
    const imagen = req.params.imagen;
    let filePath = `servidor\\imagenesEmpleados\\${imagen}`
    res.sendFile(__dirname.split("servidor")[0] + filePath);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad} = req.body;
    await pool.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad]);
    const oneEmpley = await pool.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
    const idEmployGuardado = oneEmpley.rows[0].id;
    res.json({ message: 'Empleado guardado', id: idEmployGuardado});
  }

  public async editar(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad} = req.body;
    await pool.query('UPDATE empleados SET cedula = $2, apellido = $3, nombre = $4, esta_civil = $5, genero = $6, correo = $7, fec_nacimiento = $8, estado = $9, mail_alternativo = $10, domicilio = $11, telefono = $12, id_nacionalidad = $13 WHERE id = $1 ', [id, cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad]);
    res.json({ message: 'Empleado Actualizado'});
  }

  public async crearImagenEmpleado(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let imagen = list.image[0].path.split("\\")[1];
    let id = req.params.id_empleado

    const unEmpleado = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
    if (unEmpleado.rowCount > 0) {
      unEmpleado.rows.map(async (obj) => {
        if (obj.imagen != null ){
          try {
            console.log(obj.imagen);
            let filePath = `servidor\\imagenesEmpleados\\${obj.imagen}`;
            let direccionCompleta = __dirname.split("servidor")[0] + filePath;
            fs.unlinkSync(direccionCompleta);
            await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
            res.json({ message: 'Imagen Actualizada'});
          } catch (error) {
            await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
            res.json({ message: 'Imagen Actualizada'});
          }
        } else {
          await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
          res.json({ message: 'Imagen Actualizada'});
        }
      });
    }
  }

  public async createEmpleadoTitulos(req: Request, res: Response): Promise<void> {
    const { observacion, id_empleado, id_titulo } = req.body;
    await pool.query('INSERT INTO empl_titulos ( observacion, id_empleado, id_titulo ) VALUES ($1, $2, $3)', [observacion, id_empleado, id_titulo]);
    res.json({ message: 'Titulo del empleado Guardado'});
  }
  
  public async editarTituloDelEmpleado(req: Request, res: Response): Promise<void> {
    const id = req.params.id_empleado_titulo;
    const { observacion, id_titulo} = req.body;
    await pool.query('UPDATE empl_titulos SET observacion = $1, id_titulo = $2 WHERE id = $3 ', [observacion, id_titulo, id]);
    res.json({ message: 'Titulo del empleado Actualizado'});
  }

  public async eliminarTituloDelEmpleado(req: Request, res: Response): Promise<void> {
    const id = req.params.id_empleado_titulo;
    await pool.query('DELETE FROM empl_titulos WHERE id = $1', [id]);
    res.json({ message: 'Registro eliminado' });
  }

  public async getTitulosDelEmpleado(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const unEmpleadoTitulo = await pool.query('SELECT et.id, et.observacion As observaciones, et.id_titulo, et.id_empleado, ct.nombre, nt.nombre as nivel FROM empl_titulos AS et, cg_titulos AS ct, nivel_titulo AS nt WHERE et.id_empleado = $1 and et.id_titulo = ct.id and ct.id_nivel = nt.id ORDER BY id', [id_empleado]);
    if (unEmpleadoTitulo.rowCount > 0) {
      return res.json(unEmpleadoTitulo.rows)
    }
    res.status(404).json({ text: 'El empleado no tiene titulos asignados' });
  }

}

export const EMPLEADO_CONTROLADOR = new EmpleadoControlador();

export default EMPLEADO_CONTROLADOR;
