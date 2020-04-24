import { Request, Response } from 'express';
import pool from '../../database';

class NacionalidadControlador {
  
    public async list(req: Request, res: Response) {
    const nacinalidad = await pool.query('SELECT * FROM nacionalidades');
    res.json(nacinalidad.rows);
  }

}

export const nacionalidadControlador = new NacionalidadControlador();

export default nacionalidadControlador;