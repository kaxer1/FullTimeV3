import { Request, Response } from 'express';
import pool from '../../database';
import excel from 'xlsx';
import fs from 'fs';

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

  public async ObtenerRegistroEnrolado(req: Request, res: Response): Promise<any> {
    const { id_usuario } = req.params;
    const ENROLADOS = await pool.query('SELECT id FROM cg_enrolados WHERE id_usuario = $1', [id_usuario]);
    if (ENROLADOS.rowCount > 0) {
      return res.json(ENROLADOS.rows);
    }
    else {
      return res.status(404).json({ text: 'No se ha encontrado en el catálogo enrolados' });
    }
  }

  public async ObtenerUltimoId(req: Request, res: Response) {
    const ENROLADOS = await pool.query('SELECT MAX(id) FROM cg_enrolados');
    if (ENROLADOS.rowCount > 0) {
      return res.json(ENROLADOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ActualizarEnrolado(req: Request, res: Response): Promise<void> {
    const { id_usuario, nombre, contrasenia, activo, finger, data_finger, id } = req.body;
    await pool.query('UPDATE cg_enrolados SET id_usuario = $1, nombre = $2, contrasenia = $3, activo = $4, finger = $5, data_finger = $6 WHERE id = $7', [id_usuario, nombre, contrasenia, activo, finger, data_finger, id]);
    res.json({ message: 'Usuario Enrolado actualizado exitosamente' });
  }

  public async CargaPlantillaEnrolado(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let cadena = list.uploads[0].path;
    let filename = cadena.split("\\")[1]; 
    var filePath = `./plantillas/${filename}`

    const workbook = excel.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); 
    plantilla.forEach(async (data: any) => {
      const { id_usuario, nombre, contrasenia, activo, finger, data_finger } = data;
      if(id_usuario != undefined){
        await pool.query('INSERT INTO cg_enrolados (id_usuario, nombre, contrasenia, activo, finger, data_finger) VALUES ($1, $2,$3, $4, $5, $6)', [id_usuario, nombre, contrasenia, activo, finger, data_finger]);
      } else {
        res.json({error: 'plantilla equivocada'});
      }
    });
    
    res.json({ message: 'La plantilla a sido receptada' });
    fs.unlinkSync(filePath);
  }

}

export const ENROLADOS_CONTROLADOR = new EnroladoControlador();

export default ENROLADOS_CONTROLADOR;