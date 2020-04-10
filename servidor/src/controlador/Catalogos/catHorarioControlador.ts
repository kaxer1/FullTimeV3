import { Request, Response } from 'express';
import pool from '../../database';

import excel from 'xlsx';

// const xlsxFile = require('read-excel-file/node');
 
// xlsxFile('./plantillas/horarios.xlsx').then((rows) => {
//   rows.forEach((col)=>{
//     col.forEach((data)=>{
//       console.log(data);
//       // console.log(typeof data);
//     });
//   });
// });

class HorarioControlador {

  public async ListarHorarios(req: Request, res: Response) {
    const HORARIOS = await pool.query('SELECT * FROM cg_horarios ORDER BY nombre ASC');
    if (HORARIOS.rowCount > 0) {
      return res.json(HORARIOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnHorario(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const UN_HORARIO = await pool.query('SELECT * FROM cg_horarios WHERE id = $1', [id]);
    if (UN_HORARIO.rowCount > 0) {
      return res.json(UN_HORARIO.rows)
    }
    res.status(404).json({ text: 'No se encuentran registros' });
  }

  public async CrearHorario(req: Request, res: Response): Promise<void> {
    console.log( req.file.filename);

    const workbook = excel.readFile(`./plantillas/${req.file.filename}`);
    const sheet_name_list = workbook.SheetNames;
    const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); 

    let obj: any = [];
    plantilla.forEach(data => {
      obj.push(data);
    });
      //HORA_TRABAJO --SOLO PERMITE 2 Nùmeros 1 entero, un decimal 
    console.log(obj.length);
    for(let i = 0; i <= obj.length; i++){
      const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas } = obj[i];
      console.log({ nombre, min_almuerzo, hora_trabajo, flexible, por_horas });
      // console.log(flexible);
      await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas]);
      res.json({ message: 'El horario ha sido registrado' });
    };

    res.send({
      success: true,
      message: 'file upload'  
    });
    
  }

}

export const HORARIO_CONTROLADOR = new HorarioControlador();

export default HORARIO_CONTROLADOR;