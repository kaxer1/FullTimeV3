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
class PermisosControlador {
    ListarPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PERMISOS = yield database_1.default.query('SELECT * FROM permisos');
            if (PERMISOS.rowCount > 0) {
                return res.jsonp(PERMISOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarEstadosPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PERMISOS = yield database_1.default.query('SELECT p.id, p.fec_creacion, p.descripcion, p.fec_inicio, p.documento, p.docu_nombre, p.fec_final, p.estado, e.nombre, e.apellido, e.cedula, cp.descripcion AS nom_permiso, ec.id AS id_contrato FROM permisos AS p, empl_contratos AS ec, empleados AS e, cg_tipo_permisos AS cp WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND p.id_tipo_permiso = cp.id ORDER BY fec_creacion DESC');
            if (PERMISOS.rowCount > 0) {
                return res.json(PERMISOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnPermisoInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_permiso;
            const PERMISOS = yield database_1.default.query('SELECT p.id, p.fec_creacion, p.descripcion, p.fec_inicio, p.documento, p.docu_nombre, p.fec_final, p.estado, e.nombre, e.apellido, e.cedula, e.id AS id_empleado, cp.id AS id_tipo_permiso, cp.descripcion AS nom_permiso, ec.id AS id_contrato FROM permisos AS p, empl_contratos AS ec, empleados AS e, cg_tipo_permisos AS cp WHERE p.id = $1 AND  p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND p.id_tipo_permiso = cp.id ORDER BY fec_creacion DESC', [id]);
            if (PERMISOS.rowCount > 0) {
                return res.json(PERMISOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const PERMISOS = yield database_1.default.query('SELECT * FROM permisos WHERE id = $1', [id]);
            if (PERMISOS.rowCount > 0) {
                return res.json(PERMISOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso, docu_nombre } = req.body;
            yield database_1.default.query('INSERT INTO permisos (fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso, docu_nombre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso, docu_nombre]);
            const ultimo = yield database_1.default.query('SELECT id, estado FROM permisos WHERE fec_creacion = $1 AND  id_tipo_permiso = $2 AND id_empl_contrato = $3', [fec_creacion, id_tipo_permiso, id_empl_contrato]);
            const JefesDepartamentos = yield database_1.default.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo, c.permiso_mail, c.permiso_noti FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e, config_noti AS c WHERE da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id AND e.id = c.id_empleado');
            const correoInfoPidePermiso = yield database_1.default.query('SELECT e.id, e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo FROM empl_contratos AS ecn, empleados AS e, empl_cargos AS ecr WHERE ecn.id = $1 AND ecn.id_empleado = e.id AND ecn.id = ecr.id_empl_contrato ORDER BY cargo DESC', [id_empl_contrato]);
            // const control_notificacion = await pool.query('SELECT c.permiso_mail, c.permiso_noti FROM config_noti AS c WHERE c.id_empleado = $1',[correoInfoPidePermiso.rows[0].id])
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                }
            });
            JefesDepartamentos.rows.forEach(obj => {
                if (obj.id_dep === correoInfoPidePermiso.rows[0].id_departamento && obj.id_suc === correoInfoPidePermiso.rows[0].id_sucursal) {
                    var url = `${process.env.URL_DOMAIN}/ver-permiso`;
                    let id_departamento_autoriza = obj.id_dep;
                    let id_empleado_autoriza = obj.empleado;
                    let data = {
                        to: obj.correo,
                        from: email,
                        template: 'hola',
                        subject: 'Solicitud de permiso',
                        html: `<p><b>${correoInfoPidePermiso.rows[0].nombre} ${correoInfoPidePermiso.rows[0].apellido}</b> con número de
                    cédula ${correoInfoPidePermiso.rows[0].cedula} solicita autorización de permiso: </p>
                    <a href="${url}/${ultimo.rows[0].id}">Ir a verificar permisos</a>`
                    };
                    if (obj.permiso_mail === true && obj.permiso_noti === true) {
                        smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                            }
                        }));
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: true, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: ultimo.rows[0].estado });
                    }
                    else if (obj.permiso_mail === true && obj.permiso_noti === false) {
                        smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                            }
                        }));
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: false, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: ultimo.rows[0].estado });
                    }
                    else if (obj.permiso_mail === false && obj.permiso_noti === true) {
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: true, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: ultimo.rows[0].estado });
                    }
                    else if (obj.permiso_mail === false && obj.permiso_noti === false) {
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: false, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: ultimo.rows[0].estado });
                    }
                }
            });
        });
    }
    ObtenerNumPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const NUMERO_PERMISO = yield database_1.default.query('SELECT MAX(p.num_permiso) FROM permisos AS p, empl_contratos AS ec, empleados AS e WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
            if (NUMERO_PERMISO.rowCount > 0) {
                return res.jsonp(NUMERO_PERMISO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' }).end;
            }
        });
    }
    ObtenerPermisoContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_empl_contrato } = req.params;
                const PERMISO = yield database_1.default.query('SELECT * FROM VistaNombrePermiso  WHERE id_empl_contrato = $1', [id_empl_contrato]);
                return res.jsonp(PERMISO.rows);
            }
            catch (error) {
                return res.jsonp(null);
            }
        });
    }
    getDoc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = req.params.docs;
            let filePath = `servidor\\docRespaldosPermisos\\${docs}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    guardarDocumentoPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let doc = list.uploads[0].path.split("\\")[1];
            let id = req.params.id;
            yield database_1.default.query('UPDATE permisos SET documento = $2 WHERE id = $1', [id, doc]);
            res.jsonp({ message: 'Documento Actualizado' });
        });
    }
    ActualizarEstado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { estado, id_permiso, id_departamento, id_empleado } = req.body;
            yield database_1.default.query('UPDATE permisos SET estado = $1 WHERE id = $2', [estado, id]);
            const JefeDepartamento = yield database_1.default.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo, e.apellido FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id', [id_departamento]);
            const InfoPermisoReenviarEstadoEmpleado = yield database_1.default.query('SELECT p.id, p.descripcion, p.estado, e.cedula, e.nombre, e.apellido, e.correo, co.permiso_mail, co.permiso_noti FROM permisos AS p, empl_contratos AS c, empleados AS e, config_noti AS co WHERE p.id = $1 AND p.id_empl_contrato = c.id AND c.id_empleado = e.id AND co.id_empleado = e.id AND e.id = $2', [id_permiso, id_empleado]);
            console.log(estado, id_permiso, id_departamento, id_empleado);
            console.log(JefeDepartamento.rows);
            console.log(InfoPermisoReenviarEstadoEmpleado.rows);
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
                var url = `${process.env.URL_DOMAIN}/solicitarPermiso`;
                InfoPermisoReenviarEstadoEmpleado.rows.forEach(ele => {
                    let notifi_realtime = {
                        id_send_empl: obj.empleado,
                        id_receives_depa: obj.id_dep,
                        estado: estado,
                        id_permiso: id_permiso,
                        id_vacaciones: null
                    };
                    let data = {
                        from: obj.correo,
                        to: ele.correo,
                        template: 'hola',
                        subject: 'Estado de solicitud de permiso',
                        html: `<p><b>${obj.nombre} ${obj.apellido}</b> jefe/a del departamento de <b>${obj.departamento}</b> con número de
                    cédula ${obj.cedula} a cambiado el estado de su permiso a: <b>${estado}</b></p>
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
                    if (ele.permiso_mail === true && ele.permiso_noti === true) {
                        smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                            }
                        }));
                        res.json({ message: 'Estado de permiso actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
                    }
                    else if (ele.permiso_mail === true && ele.permiso_noti === false) {
                        smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                            }
                        }));
                        res.json({ message: 'Estado de permiso actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
                    }
                    else if (ele.permiso_mail === false && ele.permiso_noti === true) {
                        res.json({ message: 'Estado de permiso actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
                    }
                    else if (ele.permiso_mail === false && ele.permiso_noti === false) {
                        res.json({ message: 'Estado de permiso actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
                    }
                });
            });
        });
    }
    ObtenerDatosSolicitud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_emple_permiso;
            const SOLICITUD = yield database_1.default.query('SELECT *FROM VistaDatoSolicitud WHERE id_emple_permiso = $1', [id]);
            if (SOLICITUD.rowCount > 0) {
                return res.json(SOLICITUD.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerDatosAutorizacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_permiso;
            const id_empleado = req.params.id_empleado;
            const SOLICITUD = yield database_1.default.query('SELECT *FROM VistaAutorizaciones WHERE id_permiso = $1 AND id_empleado = $2', [id, id_empleado]);
            if (SOLICITUD.rowCount > 0) {
                return res.json(SOLICITUD.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
}
exports.PERMISOS_CONTROLADOR = new PermisosControlador();
exports.default = exports.PERMISOS_CONTROLADOR;
