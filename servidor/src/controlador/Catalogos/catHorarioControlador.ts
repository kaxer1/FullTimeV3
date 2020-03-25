import { Request, Response } from 'express';
import pool from '../../database';

class HorarioControlador {
    public async list(req: Request, res: Response) {
      const provincia = await pool.query('SELECT * FROM cg_horarios ORDER BY nombre ASC');
      res.json(provincia.rows);
    }
  
    public async getOne(req: Request, res: Response): Promise<any> {
      const { id } = req.params;
      const unaProvincia = await pool.query('SELECT * FROM cg_horarios WHERE id = $1', [id]);
      if (unaProvincia.rowCount > 0) {
        return res.json(unaProvincia.rows)
      }
      res.status(404).json({ text: 'No se ha encontrado el horario' });
    }
  
    public async create(req: Request, res: Response): Promise<void> {
      const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas} = req.body;

      //HORA_TRABAJO --SOLO PERMITE 2 Nùmeros 1 entero, un decimal
    
      await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo,flexible, por_horas) VALUES ($1, $2,$3,$4,$5)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas]);
      
      res.json({ message: 'El horario ha sido registrado' });
    }

  
  }
  
  export const HORARIO_CONTROLADOR = new HorarioControlador();
  
  export default HORARIO_CONTROLADOR;