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
const settingsMail_1 = require("../../libs/settingsMail");
class PlanHoraExtraControlador {
    ListarPlanHoraExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN = yield database_1.default.query('SELECT e.id AS empl_id, e.codigo, e.cedula, e.nombre, e.apellido, ' +
                't.id_empl_cargo, t.id_empl_contrato, t.id_plan_extra, t.tiempo_autorizado, t.fecha_desde, t.fecha_hasta, ' +
                't.hora_inicio, t.hora_fin, (t.h_fin::interval - t.h_inicio::interval)::time AS hora_total_plan, ' +
                't.fecha_timbre, t.timbre_entrada, t.timbre_salida, ' +
                '(t.timbre_salida::interval - t.timbre_entrada::interval)::time AS hora_total_timbre, t.observacion, ' +
                't.estado AS plan_estado ' +
                'FROM empleados AS e, (SELECT * FROM timbres_entrada_plan_hora_extra AS tehe ' +
                'FULL JOIN timbres_salida_plan_hora_extra AS tshe ' +
                'ON tehe.fecha_timbre_e = tshe.fecha_timbre AND tehe.id_empl = tshe.id_empleado) AS t ' +
                'WHERE t.observacion = false AND (e.codigo::int = t.id_empleado OR e.codigo::int = t.id_empl) AND (t.estado = 1 OR t.estado = 2)');
            if (PLAN.rowCount > 0) {
                res.jsonp(PLAN.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarPlanHoraExtraObserva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN = yield database_1.default.query('SELECT e.id AS empl_id, e.codigo, e.cedula, e.nombre, e.apellido, ' +
                't.id_empl_cargo, t.id_empl_contrato, t.id_plan_extra, t.tiempo_autorizado, t.fecha_desde, t.fecha_hasta, ' +
                't.hora_inicio, t.hora_fin, (t.h_fin::interval - t.h_inicio::interval)::time AS hora_total_plan, ' +
                't.fecha_timbre, t.timbre_entrada, t.timbre_salida, ' +
                '(t.timbre_salida::interval - t.timbre_entrada::interval)::time AS hora_total_timbre, t.observacion, ' +
                't.estado AS plan_estado ' +
                'FROM empleados AS e, (SELECT * FROM timbres_entrada_plan_hora_extra AS tehe ' +
                'FULL JOIN timbres_salida_plan_hora_extra AS tshe ' +
                'ON tehe.fecha_timbre_e = tshe.fecha_timbre AND tehe.id_empl = tshe.id_empleado) AS t ' +
                'WHERE t.observacion = true AND (e.codigo::int = t.id_empleado OR e.codigo::int = t.id_empl) AND (t.estado = 1 OR t.estado = 2)');
            if (PLAN.rowCount > 0) {
                res.jsonp(PLAN.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarPlanHoraExtraAutorizada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN = yield database_1.default.query('SELECT e.id AS empl_id, e.codigo, e.cedula, e.nombre, e.apellido, ' +
                't.id_empl_cargo, t.id_empl_contrato, t.id_plan_extra, t.tiempo_autorizado, t.fecha_desde, t.fecha_hasta, ' +
                't.hora_inicio, t.hora_fin, (t.h_fin::interval - t.h_inicio::interval)::time AS hora_total_plan, ' +
                't.fecha_timbre, t.timbre_entrada, t.timbre_salida, ' +
                '(t.timbre_salida::interval - t.timbre_entrada::interval)::time AS hora_total_timbre, t.observacion, ' +
                't.estado AS plan_estado ' +
                'FROM empleados AS e, (SELECT * FROM timbres_entrada_plan_hora_extra AS tehe ' +
                'FULL JOIN timbres_salida_plan_hora_extra AS tshe ' +
                'ON tehe.fecha_timbre_e = tshe.fecha_timbre AND tehe.id_empl = tshe.id_empleado) AS t ' +
                'WHERE (e.codigo::int = t.id_empleado OR e.codigo::int = t.id_empl) AND (t.estado = 3 OR t.estado = 4)');
            if (PLAN.rowCount > 0) {
                res.jsonp(PLAN.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearPlanHoraExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado, observacion, justifica, id_empl_cargo, id_empl_contrato } = req.body;
            yield database_1.default.query('INSERT INTO plan_hora_extra (id_empl_planifica, id_empl_realiza, fecha_desde, ' +
                'fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado, observacion, justifica, ' +
                'id_empl_cargo, id_empl_contrato) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta,
                hora_inicio, hora_fin, descripcion, horas_totales, estado, observacion, justifica, id_empl_cargo, id_empl_contrato]);
            res.jsonp({ message: 'Planificacion registrada' });
        });
    }
    TiempoAutorizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const { hora } = req.body;
            let respuesta = yield database_1.default.query('UPDATE plan_hora_extra SET tiempo_autorizado = $2 WHERE id = $1', [id, hora]).then(result => {
                return { message: 'Tiempo de hora autorizada confirmada' };
            });
            res.jsonp(respuesta);
        });
    }
    ActualizarObservacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { observacion } = req.body;
            yield database_1.default.query('UPDATE plan_hora_extra SET observacion = $1 WHERE id = $2', [observacion, id]);
            res.jsonp({ message: 'Planificación Actualizada' });
            /* const JefeDepartamento = await pool.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, ' +
               'cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, ' +
               'e.nombre, e.cedula, e.correo, c.hora_extra_mail, c.hora_extra_noti FROM depa_autorizaciones AS da, ' +
               'empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e, ' +
               'config_noti AS c WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND ' +
               'da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id ' +
               'AND ecn.id_empleado = e.id AND e.id = c.id_empleado AND da.estado = true', [id_departamento]);
             const InfoHoraExtraReenviarEstadoEmpleado = await pool.query('SELECT h.descripcion, h.fec_inicio, h.fec_final, h.fec_solicita, h.estado, h.num_hora, h.id, e.id AS empleado, e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo FROM empleados AS e, empl_cargos AS ecr, hora_extr_pedidos AS h WHERE h.id = $1 AND h.id_empl_cargo = ecr.id AND e.id = h.id_usua_solicita ORDER BY cargo DESC LIMIT 1', [id_hora_extra]);
         
             console.log(InfoHoraExtraReenviarEstadoEmpleado.rows)
         
             const email = process.env.EMAIL;
             const pass = process.env.PASSWORD;
         
             let estadoHoraExtra = [
               { valor: 1, nombre: 'Pendiente' },
               { valor: 2, nombre: 'Pre-Autorizado' },
               { valor: 3, nombre: 'Aceptado' },
               { valor: 4, nombre: 'Rechazado' }
             ]
         
             let nombreEstado = '';
             estadoHoraExtra.forEach(obj => {
               if (obj.valor === estado) {
                 nombreEstado = obj.nombre
               }
             });
         
             let smtpTransport = nodemailer.createTransport({
               service: 'Gmail',
               auth: {
                 user: email,
                 pass: pass
               }
             });
         
             JefeDepartamento.rows.forEach(obj => {
               var url = `${process.env.URL_DOMAIN}/horaExtraEmpleado`;
               InfoHoraExtraReenviarEstadoEmpleado.rows.forEach(ele => {
                 let notifi_realtime = {
                   id_send_empl: obj.empleado,
                   id_receives_depa: obj.id_dep,
                   estado: nombreEstado,
                   id_permiso: null,
                   id_vacaciones: null,
                   id_hora_extra: id_hora_extra
                 }
         
                 let data = {
                   from: obj.correo,
                   to: ele.correo,
                   subject: 'Estado de solicitud de Hora Extra',
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
                         <a href="${url}">Ir a verificar estado hora extra</a>`
                 };
                 console.log(data);
                 if (obj.hora_extra_mail === true && obj.hora_extra_noti === true) {
                   smtpTransport.sendMail(data, async (error: any, info: any) => {
                     if (error) {
                       console.log(error);
                     } else {
                       console.log('Email sent: ' + info.response);
                     }
                   });
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
                 } else if (obj.hora_extra_maill === true && obj.hora_extra_noti === false) {
                   smtpTransport.sendMail(data, async (error: any, info: any) => {
                     if (error) {
                       console.log(error);
                     } else {
                       console.log('Email sent: ' + info.response);
                     }
                   });
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
                 } else if (obj.hora_extra_mail === false && obj.hora_extra_noti === true) {
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
         
                 } else if (obj.hora_extra_mail === false && obj.hora_extra_noti === false) {
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
         
                 }
               });
             });*/
        });
    }
    ActualizarEstado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { estado } = req.body;
            yield database_1.default.query('UPDATE plan_hora_extra SET estado = $1 WHERE id = $2', [estado, id]);
            res.jsonp({ message: 'Estado de Planificación Actualizada' });
            /* const JefeDepartamento = await pool.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, ' +
               'cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, ' +
               'e.nombre, e.cedula, e.correo, c.hora_extra_mail, c.hora_extra_noti FROM depa_autorizaciones AS da, ' +
               'empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e, ' +
               'config_noti AS c WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND ' +
               'da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id ' +
               'AND ecn.id_empleado = e.id AND e.id = c.id_empleado AND da.estado = true', [id_departamento]);
             const InfoHoraExtraReenviarEstadoEmpleado = await pool.query('SELECT h.descripcion, h.fec_inicio, h.fec_final, h.fec_solicita, h.estado, h.num_hora, h.id, e.id AS empleado, e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo FROM empleados AS e, empl_cargos AS ecr, hora_extr_pedidos AS h WHERE h.id = $1 AND h.id_empl_cargo = ecr.id AND e.id = h.id_usua_solicita ORDER BY cargo DESC LIMIT 1', [id_hora_extra]);
         
             console.log(InfoHoraExtraReenviarEstadoEmpleado.rows)
         
             const email = process.env.EMAIL;
             const pass = process.env.PASSWORD;
         
             let estadoHoraExtra = [
               { valor: 1, nombre: 'Pendiente' },
               { valor: 2, nombre: 'Pre-Autorizado' },
               { valor: 3, nombre: 'Aceptado' },
               { valor: 4, nombre: 'Rechazado' }
             ]
         
             let nombreEstado = '';
             estadoHoraExtra.forEach(obj => {
               if (obj.valor === estado) {
                 nombreEstado = obj.nombre
               }
             });
         
             let smtpTransport = nodemailer.createTransport({
               service: 'Gmail',
               auth: {
                 user: email,
                 pass: pass
               }
             });
         
             JefeDepartamento.rows.forEach(obj => {
               var url = `${process.env.URL_DOMAIN}/horaExtraEmpleado`;
               InfoHoraExtraReenviarEstadoEmpleado.rows.forEach(ele => {
                 let notifi_realtime = {
                   id_send_empl: obj.empleado,
                   id_receives_depa: obj.id_dep,
                   estado: nombreEstado,
                   id_permiso: null,
                   id_vacaciones: null,
                   id_hora_extra: id_hora_extra
                 }
         
                 let data = {
                   from: obj.correo,
                   to: ele.correo,
                   subject: 'Estado de solicitud de Hora Extra',
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
                         <a href="${url}">Ir a verificar estado hora extra</a>`
                 };
                 console.log(data);
                 if (obj.hora_extra_mail === true && obj.hora_extra_noti === true) {
                   smtpTransport.sendMail(data, async (error: any, info: any) => {
                     if (error) {
                       console.log(error);
                     } else {
                       console.log('Email sent: ' + info.response);
                     }
                   });
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
                 } else if (obj.hora_extra_maill === true && obj.hora_extra_noti === false) {
                   smtpTransport.sendMail(data, async (error: any, info: any) => {
                     if (error) {
                       console.log(error);
                     } else {
                       console.log('Email sent: ' + info.response);
                     }
                   });
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
                 } else if (obj.hora_extra_mail === false && obj.hora_extra_noti === true) {
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
         
                 } else if (obj.hora_extra_mail === false && obj.hora_extra_noti === false) {
                   res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
         
                 }
               });
             });*/
        });
    }
    EnviarCorreoNotificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id_empl_envia, id_empl_recive, mensaje } = req.body;
            var f = new Date();
            f.setUTCHours(f.getHours());
            let create_at = f.toJSON();
            let tipo = 1; // es el tipo de aviso 
            // console.log(id_empl_envia, id_empl_recive, create_at, mensaje, tipo);
            yield database_1.default.query('INSERT INTO realtime_timbres(create_at, id_send_empl, id_receives_empl, descripcion, tipo) VALUES($1, $2, $3, $4, $5)', [create_at, id_empl_envia, id_empl_recive, mensaje, tipo]);
            const Envia = yield database_1.default.query('SELECT nombre, apellido, correo FROM empleados WHERE id = $1', [id_empl_envia]).then(resultado => { return resultado.rows[0]; });
            const Recibe = yield database_1.default.query('SELECT nombre, apellido, correo FROM empleados WHERE id = $1', [id_empl_recive]).then(resultado => { return resultado.rows[0]; });
            let data = {
                // from: Envia.correo,
                from: settingsMail_1.email,
                to: Recibe.correo,
                subject: 'Justificacion Hora Extra',
                html: `<p><h4><b>${Envia.nombre} ${Envia.apellido}</b> </h4> escribe: <b>${mensaje}</b> 
            <h4>A usted: <b>${Recibe.nombre} ${Recibe.apellido} </b></h4>
            `
            };
            settingsMail_1.enviarMail(data);
            res.jsonp({ message: 'Se envio notificacion y correo electrónico.' });
        });
    }
    ObtenerDatosAutorizacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_plan_extra;
            const SOLICITUD = yield database_1.default.query('SELECT a.id AS id_autorizacion, a.id_documento AS empleado_estado, ' +
                'p.id AS id_plan_extra FROM autorizaciones AS a, plan_hora_extra AS p ' +
                'WHERE p.id = a.id_plan_hora_extra AND p.id = $1', [id]);
            if (SOLICITUD.rowCount > 0) {
                return res.json(SOLICITUD.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    EnviarCorreoPlanificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id_empl_envia, id_empl_recive, mensaje } = req.body;
            var f = new Date();
            f.setUTCHours(f.getHours());
            let create_at = f.toJSON();
            let tipo = 1; // es el tipo de aviso 
            // console.log(id_empl_envia, id_empl_recive, create_at, mensaje, tipo);
            yield database_1.default.query('INSERT INTO realtime_timbres(create_at, id_send_empl, id_receives_empl, descripcion, tipo) VALUES($1, $2, $3, $4, $5)', [create_at, id_empl_envia, id_empl_recive, mensaje, tipo]);
            const Envia = yield database_1.default.query('SELECT nombre, apellido, correo FROM empleados WHERE id = $1', [id_empl_envia]).then(resultado => { return resultado.rows[0]; });
            const Recibe = yield database_1.default.query('SELECT nombre, apellido, correo FROM empleados WHERE id = $1', [id_empl_recive]).then(resultado => { return resultado.rows[0]; });
            console.log(Envia.correo, 'djjj', Recibe.correo);
            let data = {
                // from: Envia.correo,
                from: settingsMail_1.email,
                to: Recibe.correo,
                subject: 'Planificación de Horas Extras',
                html: `<p><h4><b>${Envia.nombre} ${Envia.apellido}</b> </h4> escribe: <b>${mensaje}</b> 
            <h4>A usted: <b>${Recibe.nombre} ${Recibe.apellido} </b></h4>
            `
            };
            settingsMail_1.enviarMail(data);
            res.jsonp({ message: 'Se envio notificacion y correo electrónico.' });
        });
    }
}
exports.PLAN_HORA_EXTRA_CONTROLADOR = new PlanHoraExtraControlador();
exports.default = exports.PLAN_HORA_EXTRA_CONTROLADOR;
