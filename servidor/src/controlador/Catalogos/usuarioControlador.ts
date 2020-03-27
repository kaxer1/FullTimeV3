import { Request, Response } from 'express';
import pool from '../../database';

class UsuarioControlador {
  public async list(req: Request, res: Response) {
    const user = await pool.query('SELECT * FROM usuarios');
    res.json(user.rows);
  }


  public async getIdByUsuario(req: Request, res: Response): Promise<any>{
    const  {usuario} = req.params;
    const unUsuario = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
    if (unUsuario.rowCount > 0) {
      return res.json(unUsuario.rows);
    }
  
    res.status(404).json({ text: 'No se ha encontrado el usuario' });
  }

  // public async getIdByUsuario(req: Request, res: Response): Promise<any>{
  //   const  {id_empleado} = req.params;
  //   const unUsuario = await pool.query('SELECT * FROM usuarios WHERE id_empleado = $1', [id_empleado]);
  //   if (unUsuario.rowCount > 0) {
  //     return res.json(unUsuario.rows);
  //   }
  
  //   res.status(404).json({ text: 'No se ha encontrado el usuario' });
  // }

  public async create(req: Request, res: Response): Promise<void> {
    const { usuario, contrasena, estado, id_rol, id_empleado, app_habilita } = req.body;
    await pool.query('INSERT INTO usuarios ( usuario, contrasena, estado, id_rol, id_empleado, app_habilita ) VALUES ($1, $2, $3, $4, $5, $6)', [usuario, contrasena, estado, id_rol, id_empleado, app_habilita]);
    console.log(req.body);
    res.json({ message: 'Usuario Guardado'});
  }

}

export const USUARIO_CONTROLADOR = new UsuarioControlador();

export default USUARIO_CONTROLADOR;