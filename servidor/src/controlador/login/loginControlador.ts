import { Request, Response, text } from 'express';
import pool from '../../database';

class LoginControlador {

  public async ValidarCredenciales(req: Request, res: Response) {
    try {
      const { nombre_usuario, pass } = req.body;
      const USUARIO = await pool.query('SELECT id, usuario, estado, id_rol, id_empleado, app_habilita FROM accesoUsuarios($1, $2)', [nombre_usuario, pass]);
      res.json(USUARIO.rows)
    } catch (error) {
      res.json({ message: 'error' });
    }
  }

}

const LOGIN_CONTROLADOR = new LoginControlador();

export default LOGIN_CONTROLADOR ;
