import { Request, Response } from 'express';
import pool from '../../database';

class NivelTituloControlador {
  public async list(req: Request, res: Response) {
    const titulo = await pool.query('SELECT * FROM nivel_titulo ORDER BY id');
    res.json(titulo.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unNivelTitulo = await pool.query('SELECT * FROM nivel_titulo WHERE id = $1', [id]);
    if (unNivelTitulo.rowCount > 0) {
      return res.json(unNivelTitulo.rows)
    }
    res.status(404).json({ text: 'Registro no encontrado' });
  }

  public async ObtenerNivelNombre(req: Request, res: Response): Promise<any> {
    const { nombre } = req.params;
    const unNivelTitulo = await pool.query('SELECT * FROM nivel_titulo WHERE nombre = $1', [nombre]);
    if (unNivelTitulo.rowCount > 0) {
      return res.json(unNivelTitulo.rows)
    }
    res.status(404).json({ text: 'Registro no encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { nombre } = req.body;
    await pool.query('INSERT INTO nivel_titulo ( nombre ) VALUES ($1)', [nombre]);
    res.json({ message: 'Nivel del Titulo guardado' });
  }

  public async ActualizarNivelTitulo(req: Request, res: Response): Promise<void> {
    const { nombre, id } = req.body;
    await pool.query('UPDATE nivel_titulo SET nombre = $1 WHERE id = $2', [nombre, id]);
    res.json({ message: 'Nivel de Título actualizado exitosamente' });
  }

  public async EliminarNivelTitulo(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    console.log(id);
    await pool.query('DELETE FROM nivel_titulo WHERE id = $1', [id]);
    res.json({ message: 'Registro eliminado' });
  }

}

export const NIVEL_TITULO_CONTROLADOR = new NivelTituloControlador();

export default NIVEL_TITULO_CONTROLADOR;