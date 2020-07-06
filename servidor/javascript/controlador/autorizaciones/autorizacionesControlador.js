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
const nodemailer = require("nodemailer");
class AutorizacionesControlador {
    ListarAutorizaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const AUTORIZACIONES = yield database_1.default.query('SELECT * FROM autorizaciones ORDER BY id');
            if (AUTORIZACIONES.rowCount > 0) {
                return res.jsonp(AUTORIZACIONES.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerAutorizacionPorIdDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_documento;
            const AUTORIZACIONES = yield database_1.default.query('SELECT * FROM autorizaciones WHERE id_documento = $1', [id]);
            if (AUTORIZACIONES.rowCount > 0) {
                return res.jsonp(AUTORIZACIONES.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearAutorizacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento } = req.body;
            yield database_1.default.query('INSERT INTO autorizaciones ( id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento]);
            res.jsonp({ message: 'Autorizacion guardado' });
        });
    }
    ActualizarEstadoPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { estado, id_permiso, id_departamento } = req.body;
            yield database_1.default.query('UPDATE autorizaciones SET estado = $1 WHERE id = $2', [estado, id]);
            const JefeDepartamento = yield database_1.default.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo, e.apellido FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id', [id_departamento]);
            const InfoPermisoReenviarEstadoEmpleado = yield database_1.default.query('SELECT p.id, p.descripcion, p.estado, e.cedula, e.nombre, e.apellido, e.correo FROM permisos AS p, empl_contratos AS c, empleados AS e WHERE p.id = $1 AND p.id_empl_contrato = c.id AND c.id_empleado = e.id', [id_permiso]);
            const estadoAutorizacion = [
                { id: 1, nombre: 'Pendiente' },
                { id: 2, nombre: 'Pre-autorizado' },
                { id: 3, nombre: 'Autorizado' },
                { id: 4, nombre: 'Negado' },
            ];
            let nombreEstado = '';
            estadoAutorizacion.forEach(obj => {
                if (obj.id === estado) {
                    nombreEstado = obj.nombre;
                }
            });
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                }
            });
            JefeDepartamento.rows.forEach(obj => {
                var url = `${process.env.URL_DOMAIN}/datosEmpleado`;
                InfoPermisoReenviarEstadoEmpleado.rows.forEach(ele => {
                    let data = {
                        from: obj.correo,
                        to: ele.correo,
                        template: 'hola',
                        subject: 'Estado de solicitud de permiso',
                        html: `<p><b>${obj.nombre} ${obj.apellido}</b> jefe/a del departamento de <b>${obj.departamento}</b> con número de
                    cédula ${obj.cedula} a cambiado el estado de su permiso a: <b>${nombreEstado}</b></p>
                    <h4><b>Informacion del permiso</b></h4>
                    <ul>
                        <li><b>Descripción</b>: ${ele.descripcion} </li>
                        <li><b>Empleado</b>: ${ele.nombre} ${ele.apellido} </li>
                        <li><b>Cédula</b>: ${ele.cedula} </li>
                        <li><b>Sucursal</b>: ${obj.sucursal} </li>
                        <li><b>Departamento</b>: ${obj.departamento} </li>
                        </ul>
                    <a href="${url}">Ir a verificar estado permisos</a>`
                    };
                    console.log(data);
                    smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    }));
                });
            });
            res.json({ message: 'Estado de permiso actualizado exitosamente' });
        });
    }
    ActualizarEstadoVacacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { estado, id_vacaciones, id_departamento } = req.body;
            yield database_1.default.query('UPDATE autorizaciones SET estado = $1 WHERE id = $2', [estado, id]);
            const JefeDepartamento = yield database_1.default.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo, e.apellido FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id', [id_departamento]);
            const InfoVacacionesReenviarEstadoEmpleado = yield database_1.default.query('SELECT v.id, v.estado, v.fec_inicio, v.fec_final, v.fec_ingreso, e.cedula, e.nombre, e.apellido, e.correo FROM vacaciones AS v, peri_vacaciones AS pv, empl_contratos AS c, empleados AS e WHERE v.id = $1 AND v.id_peri_vacacion = pv.id AND c.id = pv.id_empl_contrato AND c.id_empleado = e.id', [id_vacaciones]);
            const estadoAutorizacion = [
                { id: 1, nombre: 'Pendiente' },
                { id: 2, nombre: 'Pre-autorizado' },
                { id: 3, nombre: 'Autorizado' },
                { id: 4, nombre: 'Negado' },
            ];
            let nombreEstado = '';
            estadoAutorizacion.forEach(obj => {
                if (obj.id === estado) {
                    nombreEstado = obj.nombre;
                }
            });
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                }
            });
            JefeDepartamento.rows.forEach(obj => {
                var url = `${process.env.URL_DOMAIN}/datosEmpleado`;
                InfoVacacionesReenviarEstadoEmpleado.rows.forEach(ele => {
                    let data = {
                        from: obj.correo,
                        to: ele.correo,
                        subject: 'Estado de solicitud de Vacacioens',
                        html: `<p><b>${obj.nombre} ${obj.apellido}</b> jefe/a del departamento de <b>${obj.departamento}</b> con número de
                    cédula ${obj.cedula} a cambiado el estado de su solicitud de vacaciones a: <b>${nombreEstado}</b></p>
                    <h4><b>Informacion de las vacaciones</b></h4>
                    <ul>
                        <li><b>Empleado</b>: ${ele.nombre} ${ele.apellido} </li>
                        <li><b>Cédula</b>: ${ele.cedula} </li>
                        <li><b>Sucursal</b>: ${obj.sucursal} </li>
                        <li><b>Departamento</b>: ${obj.departamento} </li>
                        <li><b>Fecha inicio </b>: ${ele.fec_inicio.toLocaleString().split(" ")[0]} </li> 
                        <li><b>Fecha final </b>: ${ele.fec_final.toLocaleString().split(" ")[0]} </li>
                        <li><b>Fecha ingresa </b>: ${ele.fec_ingreso.toLocaleString().split(" ")[0]} </li>
                        </ul>
                    <a href="${url}">Ir a verificar estado permisos</a>`
                    };
                    console.log(data);
                    smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    }));
                });
            });
            res.json({ message: 'Estado de las vacaciones actualizado exitosamente' });
        });
    }
}
exports.AUTORIZACION_CONTROLADOR = new AutorizacionesControlador();
exports.default = exports.AUTORIZACION_CONTROLADOR;
