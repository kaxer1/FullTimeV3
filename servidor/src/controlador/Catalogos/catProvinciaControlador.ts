import { Request, Response } from 'express';
import pool from '../../database';

class ProvinciaControlador {
  
    public async ListarProvincia(req: Request, res: Response) {
      const PROVINCIA = await pool.query('SELECT * FROM cg_provincias ORDER BY nombre, pais ASC');
      if (PROVINCIA.rowCount > 0) {
        return res.json(PROVINCIA.rows)
      }
      else {
        return res.status(404).json({ text: 'No se encuentran registros' });
      }
    }
 
    public async ObtenerUnaProvincia(req: Request, res: Response): Promise<any> {
      const { id } = req.params;
      const UNA_PROVINCIA = await pool.query('SELECT * FROM cg_provincias WHERE id = $1', [id]);
      if (UNA_PROVINCIA.rowCount > 0) {
        return res.json(UNA_PROVINCIA.rows)
      }
      else {
        return res.status(404).json({ text: 'La provincia no ha sido encontrada' });
      }
    }

    public async ObtenerIdProvincia(req: Request, res: Response): Promise<any> {
      const { nombre } = req.params;
      const UNA_PROVINCIA = await pool.query('SELECT * FROM cg_provincias WHERE nombre = $1', [nombre]);
      if (UNA_PROVINCIA.rowCount > 0) {
        return res.json(UNA_PROVINCIA.rows)
      }
      else {
        return res.status(404).json({ text: 'La provincia no ha sido encontrada' });
      }
    }
  
    public async CrearProvincia(req: Request, res: Response): Promise<void> {
      const { nombre, pais } = req.body;
      await pool.query('INSERT INTO cg_provincias (nombre, pais) VALUES ($1, $2)', [nombre, pais]);
      res.json({ message: 'La provincia ha sido guardada con éxito' });
    }
  }
  
  export const PROVINCIA_CONTROLADOR = new ProvinciaControlador();
  
  export default PROVINCIA_CONTROLADOR;