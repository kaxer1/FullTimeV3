import { Request, Response } from 'express'
import pool from '../../database';
import excel from 'xlsx';
import fs from 'fs';
const builder = require('xmlbuilder');

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
    const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre } = req.body;
    console.log({ nombre, min_almuerzo, hora_trabajo, flexible, por_horas });
    await pool.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre) VALUES ($1, $2, $3, $4, $5, $6)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre]);
    const ultimo = await pool.query('SELECT MAX(id) AS id FROM cg_horarios');

    res.jsonp({ message: 'El horario ha sido registrado', id: ultimo.rows[0].id });
  }

  public async CargarHorarioPlantilla(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let cadena = list.uploads[0].path;
    let filename = cadena.split("\\")[1];
    var filePath = `./plantillas/${filename}`

    const workbook = excel.readFile(filePath);
    const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
    const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

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
    const plantillaD = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

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
    const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre } = req.body;
    await pool.query('UPDATE cg_horarios SET nombre = $1, min_almuerzo = $2, hora_trabajo = $3, flexible = $4, por_horas = $5, doc_nombre = $6 WHERE id = $7', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre, id]);

    res.jsonp({ message: 'Tipo Permiso Actualizado' });
  }

  public async FileXML(req: Request, res: Response): Promise<any> {
    var xml = builder.create('root').ele(req.body).end({ pretty: true });
    console.log(req.body.userName);
    let filename = "Horarios-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
    fs.writeFile(`xmlDownload/${filename}`, xml, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("Archivo guardado");
    });
    res.jsonp({ text: 'XML creado', name: filename });
  }

  public async downloadXML(req: Request, res: Response): Promise<any> {
    const name = req.params.nameXML;
    let filePath = `servidor\\xmlDownload\\${name}`
    res.sendFile(__dirname.split("servidor")[0] + filePath);
  }

  public async ObtenerDocumento(req: Request, res: Response): Promise<any> {
    const docs = req.params.docs;
    let filePath = `servidor\\docRespaldosHorarios\\${docs}`
    res.sendFile(__dirname.split("servidor")[0] + filePath);
  }

  public async GuardarDocumentoHorario(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let doc = list.uploads[0].path.split("\\")[1];
    let id = req.params.id

    await pool.query('UPDATE cg_horarios SET documento = $2 WHERE id = $1', [id, doc]);
    res.jsonp({ message: 'Documento Actualizado' });
  }

  public async EditarDocumento(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { documento } = req.body;
    await pool.query('UPDATE cg_horarios SET documento = $1 WHERE id = $2', [documento, id]);

    res.jsonp({ message: 'Tipo Permiso Actualizado' });
  }

}

export const HORARIO_CONTROLADOR = new HorarioControlador();

export default HORARIO_CONTROLADOR;