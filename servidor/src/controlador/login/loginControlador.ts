import { Request, Response } from 'express';
import pool from '../../database';

const jwt = require('jsonwebtoken');

class LoginControlador {

  public async ValidarCredenciales(req: Request, res: Response) {
    try {
      const { nombre_usuario, pass } = req.body;
      const USUARIO = await pool.query('SELECT id, usuario, id_rol, id_empleado FROM accesoUsuarios($1, $2)', [nombre_usuario, pass]);
      const token =  jwt.sign({_id: USUARIO.rows[0].id}, 'llaveSecreta');
      return res.status(200).json({token, usuario: USUARIO.rows[0].usuario, rol: USUARIO.rows[0].id_rol, empleado: USUARIO.rows[0].id_empleado});
    } catch (error) {
      return res.json({ message: 'error' });
    }
  }

}

const LOGIN_CONTROLADOR = new LoginControlador();

export default LOGIN_CONTROLADOR ;


