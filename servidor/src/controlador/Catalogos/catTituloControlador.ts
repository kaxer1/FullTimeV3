import { Request, Response } from 'express'
import pool from '../../database';
import fs from 'fs';
const builder = require('xmlbuilder');

class TituloControlador {
  public async list(req: Request, res: Response) {
    const titulo = await pool.query('SELECT ct.id, ct.nombre, nt.nombre as nivel FROM cg_titulos AS ct, nivel_titulo AS nt WHERE ct.id_nivel = nt.id ORDER BY ct.nombre ASC');
    res.jsonp(titulo.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unTitulo = await pool.query('SELECT * FROM cg_titulos WHERE id = $1', [id]);
    if (unTitulo.rowCount > 0) {
      return res.jsonp(unTitulo.rows)
    }
    res.status(404).jsonp({ text: 'El empleado no ha sido encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { nombre, id_nivel } = req.body;
    await pool.query('INSERT INTO cg_titulos ( nombre, id_nivel ) VALUES ($1, $2)', [nombre, id_nivel]);
    console.log(req.body);
    res.jsonp({ message: 'Título guardado' });
  }

  public async ActualizarTitulo(req: Request, res: Response): Promise<void> {
    const { nombre, id_nivel, id } = req.body;
    await pool.query('UPDATE cg_titulos SET nombre = $1, id_nivel = $2 WHERE id = $3', [nombre, id_nivel, id]);
    res.jsonp({ message: 'Título actualizado exitosamente' });
  }

  public async EliminarRegistros(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await pool.query('DELETE FROM cg_titulos WHERE id = $1', [id]);
    res.jsonp({ message: 'Registro eliminado' });
  }

  public async FileXML(req: Request, res: Response): Promise<any> {
    var xml = builder.create('root').ele(req.body).end({ pretty: true });
    console.log(req.body.userName);
    let filename = "Titulos-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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

}

export const TITULO_CONTROLADOR = new TituloControlador();

export default TITULO_CONTROLADOR;