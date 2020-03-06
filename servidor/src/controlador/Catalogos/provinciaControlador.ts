import { Request, Response } from 'express';
import pool from '../../database';

class ProvinciaControlador {
    public async list(req: Request, res: Response) {
      const provincia = await pool.query('SELECT * FROM cg_provincias');
      res.json(provincia.rows);
    }
  
    public async getOne(req: Request, res: Response): Promise<any> {
      const { id } = req.params;
      const unaProvincia = await pool.query('SELECT * FROM cg_provincias WHERE id = $1', [id]);
      if (unaProvincia.rowCount > 0) {
        return res.json(unaProvincia.rows)
      }
      res.status(404).json({ text: 'La provincia no ha sido encontrada' });
    }
  
    public async create(req: Request, res: Response): Promise<void> {
      const { nombre } = req.body;
      await pool.query('INSERT INTO cg_provincias (nombre) VALUES ($1)', [nombre]);
      console.log(req.body);
      res.json({ message: 'La provincia ha sido guardada con éxito' });
    }
  
  }
  
  export const PROVINCIA_CONTROLADOR = new ProvinciaControlador();
  
  export default PROVINCIA_CONTROLADOR;