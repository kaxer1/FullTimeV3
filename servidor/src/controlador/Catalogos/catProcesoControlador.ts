import { Request, Response } from 'express';
import pool from '../../database';

class ProcesoControlador {
    public async list(req: Request, res: Response) {
      const provincia = await pool.query('SELECT * FROM cg_procesos');
      res.json(provincia.rows);
    }
  
    public async getOne(req: Request, res: Response): Promise<any> {
      const { id } = req.params;
      const unaProvincia = await pool.query('SELECT * FROM cg_procesos WHERE id = $1', [id]);
      if (unaProvincia.rowCount > 0) {
        return res.json(unaProvincia.rows)
      }
      res.status(404).json({ text: 'El proceso no ha sido encontrado' });
    }
  
    public async create(req: Request, res: Response): Promise<void> {
      const { nombre, proc_padre, nivel } = req.body;
      await pool.query('INSERT INTO cg_procesos (nombre,nivel, proc_padre) VALUES ($1, $2,$3)', [nombre,nivel,proc_padre]);
      console.log(req.body);
      res.json({ message: 'El departamento ha sido guardado en éxito' });
    }
    
    public async getIdByNombre(req: Request, res: Response): Promise<any>{
      const  {nombre} = req.params;
      const unIdProceso = await pool.query('SELECT id FROM cg_procesos WHERE nombre = $1', [nombre]);
      if (unIdProceso !=null) {
        return res.json(unIdProceso.rows);
      }
      res.status(404).json({ text: 'El proceso no ha sido encontrado' });
    }
  

  
  }
  
  export const PROCESOS_CONTROLADOR = new ProcesoControlador();
  
  export default PROCESOS_CONTROLADOR;