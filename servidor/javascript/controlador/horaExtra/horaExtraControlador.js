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
class HorasExtrasPedidasControlador {
    ListarHorasExtrasPedidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORAS_EXTRAS_PEDIDAS = yield database_1.default.query('SELECT * FROM hora_extr_pedidos');
            if (HORAS_EXTRAS_PEDIDAS.rowCount > 0) {
                return res.jsonp(HORAS_EXTRAS_PEDIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnaHoraExtraPedida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const HORAS_EXTRAS_PEDIDAS = yield database_1.default.query('SELECT * FROM hora_extr_pedidos WHERE id = $1', [id]);
            if (HORAS_EXTRAS_PEDIDAS.rowCount > 0) {
                return res.jsonp(HORAS_EXTRAS_PEDIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerlistaHora(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_user } = req.params;
            const HORAS_EXTRAS_PEDIDAS = yield database_1.default.query('SELECT * FROM hora_extr_pedidos WHERE id_usua_solicita = $1', [id_user]);
            if (HORAS_EXTRAS_PEDIDAS.rowCount > 0) {
                return res.jsonp(HORAS_EXTRAS_PEDIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearHoraExtraPedida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita, num_hora, descripcion, estado, tipo_funcion } = req.body;
            yield database_1.default.query('INSERT INTO hora_extr_pedidos ( id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita, num_hora, descripcion, estado, tipo_funcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita, num_hora, descripcion, estado, tipo_funcion]);
            const ultimo = yield database_1.default.query('SELECT id, estado FROM hora_extr_pedidos WHERE id_empl_cargo = $1 AND id_usua_solicita = $2 AND fec_inicio = $3 AND fec_final = $4 AND fec_solicita = $5', [id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita]);
            const JefesDepartamentos = yield database_1.default.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo, c.hora_extra_mail, c.hora_extra_noti FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e, config_noti AS c WHERE da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id AND e.id = c.id_empleado');
            const correoInfoPidePermiso = yield database_1.default.query('SELECT e.id, e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo FROM empl_contratos AS ecn, empleados AS e, empl_cargos AS ecr WHERE ecr.id = $1 AND ecn.id_empleado = e.id AND ecn.id = ecr.id_empl_contrato ORDER BY cargo DESC LIMIT 1', [id_empl_cargo]);
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;
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
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                }
            });
            JefesDepartamentos.rows.forEach(obj => {
                if (obj.id_dep === correoInfoPidePermiso.rows[0].id_departamento && obj.id_suc === correoInfoPidePermiso.rows[0].id_sucursal) {
                    var url = `${process.env.URL_DOMAIN}/ver-hora-extra`;
                    let id_departamento_autoriza = obj.id_dep;
                    let id_empleado_autoriza = obj.empleado;
                    let data = {
                        to: obj.correo,
                        from: email,
                        subject: 'Solicitud de Hora Extra',
                        html: `<p><b>${correoInfoPidePermiso.rows[0].nombre} ${correoInfoPidePermiso.rows[0].apellido}</b> con número de
          cédula ${correoInfoPidePermiso.rows[0].cedula} solicita autorización de hora extra: </p>
          <a href="${url}/${ultimo.rows[0].id}">Ir a verificar hora extra</a>`
                    };
                    if (obj.hora_extra_mail === true && obj.hora_extra_noti === true) {
                        smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                            }
                        }));
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: true, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
                    }
                    else if (obj.hora_extra_mail === true && obj.hora_extra_noti === false) {
                        smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                            }
                        }));
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: false, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
                    }
                    else if (obj.hora_extra_mail === false && obj.hora_extra_noti === true) {
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: true, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
                    }
                    else if (obj.hora_extra_mail === false && obj.hora_extra_noti === false) {
                        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: false, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
                    }
                }
            });
        });
    }
}
exports.horaExtraPedidasControlador = new HorasExtrasPedidasControlador();
exports.default = exports.horaExtraPedidasControlador;
