"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
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
    ValidarCredenciales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre_usuario, pass } = req.body;
                const USUARIO = yield database_1.default.query('SELECT id, usuario, id_rol, id_empleado FROM accesoUsuarios($1, $2)', [nombre_usuario, pass]);
                const SUC_DEP = yield database_1.default.query('SELECT c.id_departamento, c.id_sucursal, s.id_empresa, c.id AS id_cargo FROM empl_contratos AS e, empl_cargos AS c, sucursales AS s WHERE e.id_empleado = $1 AND c.id_empl_contrato = e.id AND c.id_sucursal = s.id ORDER BY c.fec_inicio DESC LIMIT 1', [USUARIO.rows[0].id_empleado]);
                if (SUC_DEP.rowCount > 0) {
                    const AUTORIZA = yield database_1.default.query('SELECT estado FROM depa_autorizaciones WHERE id_empl_cargo = $1 AND id_departamento = $2', [SUC_DEP.rows[0].id_cargo, SUC_DEP.rows[0].id_departamento]);
                    if (AUTORIZA.rowCount > 0) {
                        const token = jwt.sign({ _id: USUARIO.rows[0].id, _userName: USUARIO.rows[0].usuario, _dep: SUC_DEP.rows[0].id_departamento, _suc: SUC_DEP.rows[0].id_sucursal, _empresa: SUC_DEP.rows[0].id_empresa, estado: AUTORIZA.rows[0].estado }, 'llaveSecreta');
                        return res.status(200).jsonp({ token, usuario: USUARIO.rows[0].usuario, rol: USUARIO.rows[0].id_rol, empleado: USUARIO.rows[0].id_empleado, departamento: SUC_DEP.rows[0].id_departamento, sucursal: SUC_DEP.rows[0].id_sucursal, empresa: SUC_DEP.rows[0].id_empresa, cargo: SUC_DEP.rows[0].id_cargo, estado: AUTORIZA.rows[0].estado });
                    }
                    else {
                        const token = jwt.sign({ _id: USUARIO.rows[0].id, _userName: USUARIO.rows[0].usuario, _dep: SUC_DEP.rows[0].id_departamento, _suc: SUC_DEP.rows[0].id_sucursal, _empresa: SUC_DEP.rows[0].id_empresa, estado: false }, 'llaveSecreta');
                        return res.status(200).jsonp({ token, usuario: USUARIO.rows[0].usuario, rol: USUARIO.rows[0].id_rol, empleado: USUARIO.rows[0].id_empleado, departamento: SUC_DEP.rows[0].id_departamento, sucursal: SUC_DEP.rows[0].id_sucursal, empresa: SUC_DEP.rows[0].id_empresa, cargo: SUC_DEP.rows[0].id_cargo, estado: false });
                    }
                }
                else {
                    const token = jwt.sign({ _id: USUARIO.rows[0].id, _userName: USUARIO.rows[0].usuario }, 'llaveSecreta');
                    return res.status(200).jsonp({ token, usuario: USUARIO.rows[0].usuario, rol: USUARIO.rows[0].id_rol, empleado: USUARIO.rows[0].id_empleado });
                }
            }
            catch (error) {
                return res.jsonp({ message: 'error' });
            }
        });
    }
    CambiarContrasenia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = req.body.token;
            var contrasena = req.body.contrasena;
            try {
                const payload = jwt.verify(token, 'llaveEmail');
                const id_empleado = payload._id;
                yield database_1.default.query('UPDATE usuarios SET contrasena = $2 WHERE id_empleado = $1 ', [id_empleado, contrasena]);
                res.jsonp({ expiro: 'no', message: "Contraseña Actualizada, Intente ingresar con la nueva contraseña" });
            }
            catch (error) {
                res.jsonp({ expiro: 'si', message: "Tiempo para cambiar la contraseña expirado, vuelva a intentarlo" });
            }
        });
    }
    RestablecerContrasenia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const correo = req.body.correo;
            const correoValido = yield database_1.default.query('SELECT e.id, e.nombre, e.apellido, e.correo, u.usuario, u.contrasena FROM empleados AS e, usuarios AS u WHERE correo = $1 AND u.id_empleado = e.id', [correo]);
            if (correoValido.rows[0] == undefined)
                return res.status(401).send('Correo no valido para el usuario');
            const token = jwt.sign({ _id: correoValido.rows[0].id }, 'llaveEmail', { expiresIn: 60 * 3 });
            var url = 'http://192.168.0.192:4200/confirmar-contrasenia';
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
            smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            }));
            res.jsonp({ mail: 'si', message: 'Mail enviado' });
        });
    }
}
const LOGIN_CONTROLADOR = new LoginControlador();
exports.default = LOGIN_CONTROLADOR;
