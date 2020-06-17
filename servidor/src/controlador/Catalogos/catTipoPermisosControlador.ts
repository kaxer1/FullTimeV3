import { Request, Response } from 'express';
import fs from 'fs';
const builder = require('xmlbuilder');

import pool from '../../database';

class TipoPermisosControlador {
  public async list(req: Request, res: Response) {
    const rolPermisos = await pool.query('SELECT * FROM cg_tipo_permisos ORDER BY id');
    res.jsonp(rolPermisos.rows);
  }

  public async listAccess(req: Request, res: Response) {
    const acce_empleado = req.params.acce_empleado;
    const rolPermisos = await pool.query('SELECT * FROM cg_tipo_permisos WHERE acce_empleado = $1 ORDER BY id', [acce_empleado]);
    res.jsonp(rolPermisos.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unTipoPermiso = await pool.query('SELECT * FROM cg_tipo_permisos WHERE id = $1', [id]);
    if (unTipoPermiso.rowCount > 0) {
      return res.jsonp(unTipoPermiso.rows)
    }
    res.status(404).jsonp({ text: 'Rol permiso no encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo } = req.body;
    await pool.query('INSERT INTO cg_tipo_permisos (descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo]);
    res.jsonp({ message: 'Guardado Tipo Permiso' });
  }
  
  public async editar(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo } = req.body;
    await pool.query('UPDATE cg_tipo_permisos SET descripcion = $1, tipo_descuento = $2, num_dia_maximo = $3, num_dia_ingreso = $4, vaca_afecta = $5, anio_acumula = $6, correo = $7, gene_justificacion = $8, fec_validar = $9, acce_empleado = $10, actualizar = $11, autorizar = $12, eliminar = $13, legalizar = $14, preautorizar = $15, almu_incluir = $16, num_dia_justifica = $17, num_hora_maximo = $18 WHERE id = $19', [descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo, id]);
    res.jsonp({ message: 'Tipo Permiso Actualizado' });
  }

  public async FileXML(req: Request, res: Response): Promise<any> {
    var xml = builder.create('root').ele(req.body).end({ pretty: true });
    console.log(req.body.userName);
    let filename = "TipoPermisos-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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

export const TIPO_PERMISOS_CONTROLADOR = new TipoPermisosControlador();

export default TIPO_PERMISOS_CONTROLADOR;