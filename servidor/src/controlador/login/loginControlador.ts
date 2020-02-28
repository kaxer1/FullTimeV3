import { Request, Response, text } from 'express';

import { QueryResult } from 'pg';

import pool from '../../database';


class LoginControlador {

  public async validar(req: Request, res: Response): Promise<void> {
    const { nombre_usuario, pass } = req.body;
    const rol = await pool.query('SELECT * FROM acceso_usuarios($1, $2)', [nombre_usuario, pass]);
    console.log(rol.rows);
    res.json(rol.rows[0]);

  }

}

const loginControlador = new LoginControlador();

export default loginControlador;
