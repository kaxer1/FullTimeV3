import { Request, Response } from 'express';
import pool from '../../database';

class UsuarioControlador {
  public async list(req: Request, res: Response) {
    const USUARIOS = await pool.query('SELECT * FROM usuarios');
    if (USUARIOS.rowCount > 0) {
      return res.jsonp(USUARIOS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }


  public async getIdByUsuario(req: Request, res: Response): Promise<any> {
    const { usuario } = req.params;
    const unUsuario = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
    if (unUsuario.rowCount > 0) {
      return res.jsonp(unUsuario.rows);
    }
    else {
      res.status(404).jsonp({ text: 'No se ha encontrado el usuario' });
    }
  }

  public async ObtenerDatosUsuario(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const UN_USUARIO = await pool.query('SELECT * FROM usuarios WHERE id_empleado = $1', [id_empleado]);
    if (UN_USUARIO.rowCount > 0) {
      return res.jsonp(UN_USUARIO.rows);
    }
    else {
      res.status(404).jsonp({ text: 'No se ha encontrado el usuario' });
    }
  }

  public async ListarUsuriosNoEnrolados(req: Request, res: Response) {
    const USUARIOS = await pool.query('SELECT u.id, u.usuario, ce.id_usuario FROM usuarios AS u LEFT JOIN cg_enrolados AS ce ON u.id = ce.id_usuario WHERE ce.id_usuario IS null');
    if (USUARIOS.rowCount > 0) {
      return res.jsonp(USUARIOS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CambiarPasswordUsuario(req: Request, res: Response): Promise<any> {
    const { contrasena, id_empleado } = req.body;
    const UN_USUARIO = await pool.query('UPDATE usuarios SET contrasena = $1 WHERE id_empleado = $2', [contrasena, id_empleado]);
    res.jsonp({ message: 'Registro actualizado exitosamente' });
  }

  // public async getIdByUsuario(req: Request, res: Response): Promise<any>{
  //   const  {id_empleado} = req.params;
  //   const unUsuario = await pool.query('SELECT * FROM usuarios WHERE id_empleado = $1', [id_empleado]);
  //   if (unUsuario.rowCount > 0) {
  //     return res.jsonp(unUsuario.rows);
  //   }

  //   res.status(404).jsonp({ text: 'No se ha encontrado el usuario' });
  // }

  public async create(req: Request, res: Response): Promise<void> {
    const { usuario, contrasena, estado, id_rol, id_empleado, app_habilita } = req.body;
    await pool.query('INSERT INTO usuarios ( usuario, contrasena, estado, id_rol, id_empleado, app_habilita ) VALUES ($1, $2, $3, $4, $5, $6)', [usuario, contrasena, estado, id_rol, id_empleado, app_habilita]);
    res.jsonp({ message: 'Usuario Guardado' });
  }

}

export const USUARIO_CONTROLADOR = new UsuarioControlador();

export default USUARIO_CONTROLADOR;