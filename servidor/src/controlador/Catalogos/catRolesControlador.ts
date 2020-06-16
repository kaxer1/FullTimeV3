import { Request, Response, text } from 'express'

import pool from '../../database';


class RolesControlador {

  public async ListarRoles(req: Request, res: Response) {
    const ROL = await pool.query('SELECT * FROM cg_roles');
    if (ROL.rowCount > 0) {
      return res.jsonp(ROL.rows)
    } else {
      res.status(404).jsonp({ text: 'Registro no encontrado' });
    }
  }

  public async ObtnenerUnRol(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const ROL = await pool.query('SELECT * FROM cg_roles WHERE id = $1', [id]);
    if (ROL.rowCount > 0) {
      return res.jsonp(ROL.rows)
    } else {
      res.status(404).jsonp({ text: 'Registro no encontrado' });
    }
  }

  public async CrearRol(req: Request, res: Response): Promise<void> {
    const { nombre } = req.body;
    await pool.query('INSERT INTO cg_roles (nombre) VALUES ($1)', [nombre]);
    res.jsonp({ message: 'Rol guardado' });
  }

  public async ActualizarRol(req: Request, res: Response): Promise<void> {
    const { nombre, id } = req.body;
    await pool.query('UPDATE cg_roles SET nombre = $1 WHERE id = $2', [nombre, id]);
    res.jsonp({ message: 'Registro Actualizado' });
  }

  // public async update(req: Request, res: Response): Promise<void> {
  //   const { id } = req.params;
  //   const { descripcion, usuarios } = req.body;
  //   await pool.query('UPDATE cg_roles SET descripcion = $1, usuarios = $2 WHERE id = $3', [descripcion, usuarios, id]);
  //   //res.jsonp({text: 'eliminado un dato ' + req.params.id});
  //   res.jsonp({ message: 'Rol actualizado exitosamente' });
  //   // res.jsonp({text: 'Actualizando un dato ' + req.params.id});
  // }

  // public async delete(req: Request, res: Response): Promise<void> {
  //   const { id } = req.params;
  //   await pool.query('DELETE FROM roles WHERE id = $1', [id]);
  //   //res.jsonp({text: 'eliminado un dato ' + req.params.id});
  //   res.jsonp({ message: 'Rol eliminado' });
  // }
}

const ROLES_CONTROLADOR = new RolesControlador();

export default ROLES_CONTROLADOR;
