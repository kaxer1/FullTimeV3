import { Request, Response } from 'express';
import pool from '../../database';

class DepartamentoControlador {
    public async list(req: Request, res: Response) {
      const provincia = await pool.query('SELECT * FROM cg_departamentos');
      res.json(provincia.rows);
    }
  
    public async getOne(req: Request, res: Response): Promise<any> {
      const { id } = req.params;
      const unaProvincia = await pool.query('SELECT * FROM cg_departamentos WHERE id = $1', [id]);
      if (unaProvincia.rowCount > 0) {
        return res.json(unaProvincia.rows)
      }
      res.status(404).json({ text: 'El departamento no ha sido encontrado' });
    }
  
    public async create(req: Request, res: Response): Promise<void> {
      const { nombre,depa_padre,nivel} = req.body;
      await pool.query('INSERT INTO cg_departamentos (nombre) VALUES ($1, $2,$3)', [nombre,depa_padre,nivel]);
      console.log(req.body);
      res.json({ message: 'El departamento ha sido guardado en éxito' });
    }

    public async getIdByNombre(req: Request, res: Response): Promise<any>{
      const  {nombre} = req.params;
      const unIdProceso = await pool.query('SELECT id FROM cg_departamentos WHERE nombre = $1', [nombre]);
      if (unIdProceso.rowCount > 0) {
        return res.json(unIdProceso.rows);
      }
      res.status(404).json({ text: 'El departamento no ha sido encontrado' });
    }
  
  
  }
  
  export const DEPARTAMENTO_CONTROLADOR = new DepartamentoControlador();
  
  export default DEPARTAMENTO_CONTROLADOR;