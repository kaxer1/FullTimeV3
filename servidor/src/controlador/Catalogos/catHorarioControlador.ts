import { Request, Response } from 'express';
import pool from '../../database';
import excel from 'xlsx';
import fs from 'fs';

class HorarioControlador {

  public async ListarHorarios(req: Request, res: Response) {
    const HORARIOS = await pool.query('SELECT * FROM cg_horarios ORDER BY id');
    if (HORARIOS.rowCount > 0) {
      return res.jsonp(HORARIOS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnHorario(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const UN_HORARIO = await pool.query('SELECT * FROM cg_horarios WHERE id = $1', [id]);
    if (UN_HORARIO.rowCount > 0) {
      return res.jsonp(UN_HORARIO.rows)
    }
    else {
      res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearHorario(req: Request, res: Response): Promise<void> {
    //HORA_TRABAJO --SOLO PERMITE 2 Nùmeros 1 entero, un decimal 
    const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas } = req.body;
    console.log({ nombre, min_almuerzo, hora_trabajo, flexible, por_horas });
    await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas]);
    res.jsonp({ message: 'El horario ha sido registrado' });
  }

  public async CrearHorarioPlantilla(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let cadena = list.uploads[0].path;
    let filename = cadena.split("\\")[1];
    var filePath = `./plantillas/${filename}`

    const workbook = excel.readFile(filePath);
    const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
    const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    plantilla.forEach(async (data: any) => {
      var { nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas } = data;
      //console.log("datos", data);
      //console.log("almuerzo", min_almuerzo);
      if (minutos_almuerzo != undefined) {
        //console.log("datos", data);
        //console.log("almuerzo", min_almuerzo);
        await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
      } else {
        minutos_almuerzo = 0;
        await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
      }
    });

    res.jsonp({ message: 'La plantilla a sido receptada' });
    fs.unlinkSync(filePath);
  }

  public async CrearHorarioyDetallePlantilla(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let cadena = list.uploads[0].path;
    let filename = cadena.split("\\")[1];
    var filePath = `./plantillas/${filename}`

    const workbook = excel.readFile(filePath);
    const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
    const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const plantillaD = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    /** Horarios */
    plantilla.forEach(async (data: any) => {
      var { nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas } = data;
      if (nombre_horario != undefined) {
        if (minutos_almuerzo != undefined) {
          //console.log("datos", data);
          await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
        } else {
          minutos_almuerzo = 0;
          await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
        }
      }
      else {
        console.log("vacio")
      }
    });
    console.log("termina");
    /** Detalle de Horarios */
    plantillaD.forEach(async (data: any) => {
      var { nombre_horarios, orden, hora, nocturno, tipo_accion, minutos_espera } = data;
      var nombre = nombre_horarios;
      console.log("datos", nombre);
      //console.log("datos", data)
      const horariosTotales = await pool.query('SELECT * FROM cg_horarios');
      console.log(horariosTotales.rows)
      const idHorario = await pool.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
      var id_horario = idHorario.rows[0]['id'];
      console.log("horarios", id_horario)
      if (minutos_espera != undefined) {
        console.log("entra");
        await pool.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
      } else {
        minutos_espera = '00:00';
        await pool.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
      }
    });
    res.jsonp({ message: 'La plantilla a sido receptada' });
    fs.unlinkSync(filePath);
  }

  public async EditarHorario(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas } = req.body;
    await pool.query('UPDATE cg_horarios SET nombre = $1, min_almuerzo = $2, hora_trabajo = $3, flexible = $4, por_horas = $5 WHERE id = $6', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas, id]);
    
    res.jsonp({ message: 'Tipo Permiso Actualizado' });
  }


}

export const HORARIO_CONTROLADOR = new HorarioControlador();

export default HORARIO_CONTROLADOR;