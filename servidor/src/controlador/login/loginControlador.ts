import { Request, Response } from 'express';
import pool from '../../database';

const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const email = 'casapazminoV3@gmail.com';
const pass = 'fulltimev3';
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});

class LoginControlador {

  public async ValidarCredenciales(req: Request, res: Response) {
    try {
      const { nombre_usuario, pass } = req.body;
      const USUARIO = await pool.query('SELECT id, usuario, id_rol, id_empleado FROM accesoUsuarios($1, $2)', [nombre_usuario, pass]);
      const token =  jwt.sign({_id: USUARIO.rows[0].id}, 'llaveSecreta');
      return res.status(200).json({token, usuario: USUARIO.rows[0].usuario, rol: USUARIO.rows[0].id_rol, empleado: USUARIO.rows[0].id_empleado});
    } catch (error) {
      return res.json({ message: 'error' });
    }
  }

  public async CambiarContrasenia(req: Request, res: Response) {
    var token = req.body.token;
    var contrasena = req.body.contrasena;
    try {
      const payload = jwt.verify(token, 'llaveEmail');
      const id_empleado = payload._id;
      await pool.query('UPDATE usuarios SET contrasena = $2 WHERE id_empleado = $1 ', [id_empleado, contrasena]);
      res.json({expiro: 'no', message: "Contraseña Actualizada, Intente ingresar con la nueva contraseña"});
    } catch (error) {
      res.json({expiro: 'si', message: "Tiempo para cambiar la contraseña expirado, vuelva a intentarlo"});
    }
  }

  public async RestablecerContrasenia(req: Request, res: Response) {
    const correo = req.body.correo;
    const correoValido = await pool.query('SELECT e.id, e.nombre, e.apellido, e.correo, u.usuario, u.contrasena FROM empleados AS e, usuarios AS u WHERE correo = $1 AND u.id_empleado = e.id', [correo]);
    if(correoValido.rows[0] == undefined) return res.status(401).send('Correo no valido para el usuario');
    
    const token =  jwt.sign({_id: correoValido.rows[0].id}, 'llaveEmail', {expiresIn: 60 * 3 });

    var url = 'http://localhost:4200/confirmar-contrasenia';
    var data = {
      to: correoValido.rows[0].correo,
      from: email,
      template: 'forgot-password-email',
      subject: 'Recupera tu contraseña!',
      html: `<p>Hola <b>${correoValido.rows[0].nombre.split(' ')[0] + ' ' + correoValido.rows[0].apellido.split(' ')[0]}</b>
       da click en el siguiente link para poder restaurar tu contraseña: </p>
        <a href="${url}/${token}">
        ${url}/${token}
        </a>
      `
    };

    smtpTransport.sendMail(data, async (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({mail: 'si', message: 'Mail enviado'})

  }

}

const LOGIN_CONTROLADOR = new LoginControlador();

export default LOGIN_CONTROLADOR ;


