import { Request, Response } from 'express';
import pool from '../../database';

class TituloControlador {
  public async list(req: Request, res: Response) {
    const titulo = await pool.query('SELECT * FROM cg_titulo');
    res.json(titulo.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unTitulo = await pool.query('SELECT * FROM cg_titulo WHERE id = $1', [id]);
    if (unTitulo.rowCount > 0) {
      return res.json(unTitulo.rows[0])
    }
    res.status(404).json({ text: 'El empleado no ha sido encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { nombre, nivel } = req.body;
    await pool.query('INSERT INTO cg_titulo ( nombre, nivel ) VALUES ($1, $2)', [nombre, nivel]);
    console.log(req.body);
    res.json({ message: 'Titulo guardado' });
  }

}

export const tituloControlador = new TituloControlador();

export default tituloControlador;