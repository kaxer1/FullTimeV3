import { Request, Response } from 'express';
import pool from '../../database';

class EnroladoControlador {

  public async ListarEnrolados(req: Request, res: Response) {
    const ENROLADOS = await pool.query('SELECT * FROM cg_enrolados');
    if (ENROLADOS.rowCount > 0) {
      return res.json(ENROLADOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnEnrolado(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const ENROLADOS = await pool.query('SELECT * FROM cg_enrolados WHERE id = $1', [id]);
    if (ENROLADOS.rowCount > 0) {
      return res.json(ENROLADOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async CrearEnrolado(req: Request, res: Response): Promise<void> {
    const { id_usuario, nombre, contrasenia, activo, finger, data_finger } = req.body;
    await pool.query('INSERT INTO cg_enrolados (id_usuario, nombre, contrasenia, activo, finger, data_finger) VALUES ($1, $2,$3, $4, $5, $6)', [id_usuario, nombre, contrasenia, activo, finger, data_finger]);
    res.json({ message: 'Se ha añadido correctamente al catálogo enrolados' });
  }

  public async ObtenerIdEnroladoNombre(req: Request, res: Response): Promise<any> {
    const { nombre } = req.params;
    const ENROLADOS = await pool.query('SELECT id FROM cg_enrolados WHERE nombre = $1', [nombre]);
    if (ENROLADOS != null) {
      return res.json(ENROLADOS.rows);
    }
    res.status(404).json({ text: 'No se ha encontrado en el catálogo enrolados' });
  }
  
}

export const ENROLADOS_CONTROLADOR = new EnroladoControlador();

export default ENROLADOS_CONTROLADOR;