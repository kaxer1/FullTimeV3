import { Request, Response, text } from 'express';
const builder = require('xmlbuilder');
import fs from 'fs';

import pool from '../../database';


class RolesControlador {

  public async ListarRoles(req: Request, res: Response) {
    const ROL = await pool.query('SELECT * FROM cg_roles ORDER BY nombre ASC');
    if (ROL.rowCount > 0) {
      return res.jsonp(ROL.rows)
    } else {
      res.status(404).jsonp({ text: 'Registro no encontrado' });
    }
  }

  public async ListarRolesActualiza(req: Request, res: Response) {
    const id = req.params.id;
    const ROL = await pool.query('SELECT * FROM cg_roles WHERE NOT id = $1', [id]);
    if (ROL.rowCount > 0) {
      return res.jsonp(ROL.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtnenerUnRol(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const ROL = await pool.query('SELECT * FROM cg_roles WHERE id = $1', [id]);
    if (ROL.rowCount > 0) {
      return res.jsonp(ROL.rows)
    } else {
      res.status(404).jsonp({ text: 'Registro no encontrado' });
    }
  }

  public async CrearRol(req: Request, res: Response): Promise<void> {
    const { nombre } = req.body;
    await pool.query('INSERT INTO cg_roles (nombre) VALUES ($1)', [nombre]);
    res.jsonp({ message: 'Rol guardado' });
  }

  public async ActualizarRol(req: Request, res: Response): Promise<void> {
    const { nombre, id } = req.body;
    await pool.query('UPDATE cg_roles SET nombre = $1 WHERE id = $2', [nombre, id]);
    res.jsonp({ message: 'Registro Actualizado' });
  }

  public async EliminarRol(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await pool.query('DELETE FROM cg_roles WHERE id = $1', [id]);
    res.jsonp({ message: 'Registro eliminado' });
  }

  // public async update(req: Request, res: Response): Promise<void> {
  //   const { id } = req.params;
  //   const { descripcion, usuarios } = req.body;
  //   await pool.query('UPDATE cg_roles SET descripcion = $1, usuarios = $2 WHERE id = $3', [descripcion, usuarios, id]);
  //   //res.jsonp({text: 'eliminado un dato ' + req.params.id});
  //   res.jsonp({ message: 'Rol actualizado exitosamente' });
  //   // res.jsonp({text: 'Actualizando un dato ' + req.params.id});
  // }

  // public async delete(req: Request, res: Response): Promise<void> {
  //   const { id } = req.params;
  //   await pool.query('DELETE FROM roles WHERE id = $1', [id]);
  //   //res.jsonp({text: 'eliminado un dato ' + req.params.id});
  //   res.jsonp({ message: 'Rol eliminado' });
  // }

  public async FileXML(req: Request, res: Response): Promise<any> {
    var xml = builder.create('root').ele(req.body).end({ pretty: true });
    console.log(req.body.userName);
    let filename = "Roles-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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

const ROLES_CONTROLADOR = new RolesControlador();

export default ROLES_CONTROLADOR;
