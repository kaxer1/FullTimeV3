import { Request, Response } from 'express';
import pool from '../../database';

class UsuarioControlador {
  public async list(req: Request, res: Response) {
    const titulo = await pool.query('SELECT * FROM usuarios');
    res.json(titulo.rows);
  }


  public async getIdByUsuario(req: Request, res: Response): Promise<any>{
    const  {usuario} = req.params;
    const unUsuario = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
    if (unUsuario.rowCount > 0) {
      return res.json(unUsuario.rows);
    }
  
    res.status(404).json({ text: 'No se ha encontrado el usuario' });
  }

}

export const USUARIO_CONTROLADOR = new UsuarioControlador();

export default USUARIO_CONTROLADOR;