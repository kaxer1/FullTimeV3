import { Request, Response } from 'express';
import pool from '../../database';

class TituloControlador {
  public async list(req: Request, res: Response) {
    const titulo = await pool.query('SELECT ct.id, ct.nombre, nt.nombre as nivel FROM cg_titulos AS ct, nivel_titulo AS nt WHERE ct.id_nivel = nt.id');
    res.json(titulo.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unTitulo = await pool.query('SELECT * FROM cg_titulos WHERE id = $1', [id]);
    if (unTitulo.rowCount > 0) {
      return res.json(unTitulo.rows)
    }
    res.status(404).json({ text: 'El empleado no ha sido encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { nombre, id_nivel } = req.body;
    await pool.query('INSERT INTO cg_titulos ( nombre, id_nivel ) VALUES ($1, $2)', [nombre, id_nivel]);
    console.log(req.body);
    res.json({ message: 'Título guardado' });
  }

  public async ActualizarTitulo(req: Request, res: Response): Promise<void> {
    const { nombre, id_nivel, id } = req.body;
    await pool.query('UPDATE cg_titulos SET nombre = $1, id_nivel = $2 WHERE id = $3', [nombre, id_nivel, id]);
    res.json({ message: 'Título actualizado exitosamente' });
  }

}

export const TITULO_CONTROLADOR = new TituloControlador();

export default TITULO_CONTROLADOR;