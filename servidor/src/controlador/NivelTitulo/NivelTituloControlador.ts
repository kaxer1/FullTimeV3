import { Request, Response } from 'express';
import pool from '../../database';

class NivelTituloControlador {
  public async list(req: Request, res: Response) {
    const titulo = await pool.query('SELECT * FROM nivel_titulo');
    res.json(titulo.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unNivelTitulo = await pool.query('SELECT * FROM nivel_titulo WHERE id = $1', [id]);
    if (unNivelTitulo.rowCount > 0) {
      return res.json(unNivelTitulo.rows)
    }
    res.status(404).json({ text: 'El empleado no ha sido encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { nombre } = req.body;
    await pool.query('INSERT INTO nivel_titulo ( nombre ) VALUES ($1)', [nombre]);
    res.json({ message: 'Nivel del Titulo guardado' });
  }

}

export const nivelTituloControlador = new NivelTituloControlador();

export default nivelTituloControlador;