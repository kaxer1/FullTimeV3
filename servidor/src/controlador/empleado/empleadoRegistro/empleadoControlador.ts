import { Request, Response } from 'express';
import pool from '../../../database';
const path = require("path");
import excel from 'xlsx';
import fs from 'fs';
import { Md5 } from 'ts-md5';
const builder = require('xmlbuilder');

class EmpleadoControlador {

  public async list(req: Request, res: Response) {
    const empleado = await pool.query('SELECT * FROM empleados ORDER BY id');
    res.jsonp(empleado.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unEmpleado = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
    if (unEmpleado.rowCount > 0) {
      return res.jsonp(unEmpleado.rows)
    }
    res.status(404).jsonp({ text: 'El empleado no ha sido encontrado' });
  }

  public async getImagen(req: Request, res: Response): Promise<any> {
    const imagen = req.params.imagen;
    let filePath = `servidor\\imagenesEmpleados\\${imagen}`
    res.sendFile(__dirname.split("servidor")[0] + filePath);
  }

  public async create(req: Request, res: Response) {
    try {
      const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo } = req.body;
      await pool.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo]);
      const oneEmpley = await pool.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
      const idEmployGuardado = oneEmpley.rows[0].id;
      res.jsonp({ message: 'Empleado guardado', id: idEmployGuardado });
    }
    catch (error) {
      return res.jsonp({ message: 'error' });
    }
  }

  public async editar(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo } = req.body;
      await pool.query('UPDATE empleados SET cedula = $2, apellido = $3, nombre = $4, esta_civil = $5, genero = $6, correo = $7, fec_nacimiento = $8, estado = $9, mail_alternativo = $10, domicilio = $11, telefono = $12, id_nacionalidad = $13, codigo = $14 WHERE id = $1 ', [id, cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo]);
      res.jsonp({ message: 'Empleado Actualizado' });
    }
    catch (error) {
      return res.jsonp({ message: 'error' });
    }
  }

  public async crearImagenEmpleado(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let imagen = list.image[0].path.split("\\")[1];
    let id = req.params.id_empleado

    const unEmpleado = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
    if (unEmpleado.rowCount > 0) {
      unEmpleado.rows.map(async (obj) => {
        if (obj.imagen != null) {
          try {
            console.log(obj.imagen);
            let filePath = `servidor\\imagenesEmpleados\\${obj.imagen}`;
            let direccionCompleta = __dirname.split("servidor")[0] + filePath;
            fs.unlinkSync(direccionCompleta);
            await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
            res.jsonp({ message: 'Imagen Actualizada' });
          } catch (error) {
            await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
            res.jsonp({ message: 'Imagen Actualizada' });
          }
        } else {
          await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
          res.jsonp({ message: 'Imagen Actualizada' });
        }
      });
    }
  }

  public async CargaPlantillaEmpleadoUsuario(req: Request, res: Response): Promise<void> {
    let list: any = req.files;
    let cadena = list.uploads[0].path;
    let filename = cadena.split("\\")[1];
    var filePath = `./plantillas/${filename}`

    const workbook = excel.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    plantilla.forEach(async (data: any) => {

      // realiza un capital letter a los nombres y apellidos
      let nombres = data.nombre.split(' ');
      let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
      let name2 = nombres[1].charAt(0).toUpperCase() + nombres[1].slice(1);
      const nombre = name1 + ' ' + name2;

      let apellidos = data.apellido.split(' ');
      let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
      let lastname2 = apellidos[1].charAt(0).toUpperCase() + apellidos[1].slice(1);
      const apellido = lastname1 + ' ' + lastname2;

      // encriptar contraseña
      const md5 = new Md5();
      const contrasena = md5.appendStr(data.contrasena).end();

      const { cedula, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo, usuario, estado_user, id_rol, app_habilita } = data;

      if (cedula != undefined) {
        await pool.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo]);
        const oneEmpley = await pool.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
        const id_empleado = oneEmpley.rows[0].id;
        await pool.query('INSERT INTO usuarios ( usuario, contrasena, estado, id_rol, id_empleado, app_habilita ) VALUES ($1, $2, $3, $4, $5, $6)', [usuario, contrasena, estado_user, id_rol, id_empleado, app_habilita]);
      } else {
        res.jsonp({ error: 'plantilla equivocada' });
      }
    });

    res.jsonp({ message: 'La plantilla a sido receptada' });
    fs.unlinkSync(filePath);
  }

  public async createEmpleadoTitulos(req: Request, res: Response): Promise<void> {
    const { observacion, id_empleado, id_titulo } = req.body;
    await pool.query('INSERT INTO empl_titulos ( observacion, id_empleado, id_titulo ) VALUES ($1, $2, $3)', [observacion, id_empleado, id_titulo]);
    res.jsonp({ message: 'Titulo del empleado Guardado' });
  }

  public async editarTituloDelEmpleado(req: Request, res: Response): Promise<void> {
    const id = req.params.id_empleado_titulo;
    const { observacion, id_titulo } = req.body;
    await pool.query('UPDATE empl_titulos SET observacion = $1, id_titulo = $2 WHERE id = $3 ', [observacion, id_titulo, id]);
    res.jsonp({ message: 'Titulo del empleado Actualizado' });
  }

  public async eliminarTituloDelEmpleado(req: Request, res: Response): Promise<void> {
    const id = req.params.id_empleado_titulo;
    await pool.query('DELETE FROM empl_titulos WHERE id = $1', [id]);
    res.jsonp({ message: 'Registro eliminado' });
  }

  public async getTitulosDelEmpleado(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const unEmpleadoTitulo = await pool.query('SELECT et.id, et.observacion As observaciones, et.id_titulo, et.id_empleado, ct.nombre, nt.nombre as nivel FROM empl_titulos AS et, cg_titulos AS ct, nivel_titulo AS nt WHERE et.id_empleado = $1 and et.id_titulo = ct.id and ct.id_nivel = nt.id ORDER BY id', [id_empleado]);
    if (unEmpleadoTitulo.rowCount > 0) {
      return res.jsonp(unEmpleadoTitulo.rows)
    }
    res.status(404).jsonp({ text: 'El empleado no tiene titulos asignados' });
  }

  public async FileXML(req: Request, res: Response): Promise<any> {
    var xml = builder.create('root').ele(req.body).end({ pretty: true });
    console.log(req.body.userName);
    let filename = "Empleado-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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

  public async ObtenerDepartamentoEmpleado(req: Request, res: Response): Promise<any> {
    const { id_emple, id_cargo } = req.body;
    const DEPARTAMENTO = await pool.query('SELECT *FROM VistaDepartamentoEmpleado WHERE id_emple = $1 AND id_cargo = $2', [id_emple, id_cargo]);
    if (DEPARTAMENTO.rowCount > 0) {
      return res.jsonp(DEPARTAMENTO.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'Registros no encontrados' });
    }
  }



}

export const EMPLEADO_CONTROLADOR = new EmpleadoControlador();

export default EMPLEADO_CONTROLADOR;
