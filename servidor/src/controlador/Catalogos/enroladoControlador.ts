import { Request, Response } from 'express';
import pool from '../../database';

class EnroladoControlador {

    public async list(req: Request, res: Response) {
      const provincia = await pool.query('SELECT * FROM cg_enrolados');
      res.json(provincia.rows);
    }
  
    public async getOne(req: Request, res: Response): Promise<any> {
      const { id } = req.params;
      const unEnrolado = await pool.query('SELECT * FROM cg_enrolados WHERE id = $1', [id]);
      if (unEnrolado.rowCount > 0) {
        return res.json(unEnrolado.rows)
      }
      res.status(404).json({ text: 'No se ha encontrado en el catálogo de enrolados' });
    }
  
    public async create(req: Request, res: Response): Promise<void> {
      const { id_usuario, nombre, contrasenia, activo, finger, data_finger } = req.body;
      await pool.query('INSERT INTO cg_enrolados (id_usuario, nombre, contrasenia, activo, finger, data_finger) VALUES ($1, $2,$3, $4, $5, $6)', [id_usuario, nombre, contrasenia, activo, finger, data_finger]);
      console.log(req.body);
      res.json({ message: 'Se ha añadido correctamente al catalogo enrolados' });
    }
    
    public async getIdByNombre(req: Request, res: Response): Promise<any>{
      const  {nombre} = req.params;
      const unIdEnrolado = await pool.query('SELECT id FROM cg_enrolados WHERE nombre = $1', [nombre]);
      if (unIdEnrolado !=null) {
        return res.json(unIdEnrolado.rows);
      }
      res.status(404).json({ text: 'No se ha encontrado en el catàlogo enrolados' });
    }
  

  
  }
  
  export const ENROLADOS_CONTROLADOR = new EnroladoControlador();
  
  export default ENROLADOS_CONTROLADOR;