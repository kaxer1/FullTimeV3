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
exports.PLAN_COMIDAS_CONTROLADOR = void 0;
const database_1 = __importDefault(require("../../database"));
const settingsMail_1 = require("../../libs/settingsMail");
class PlanComidasControlador {
    /** SOLICITUD DE COMIDAS */
    EncontrarSolicitaComidaNull(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN_COMIDAS = yield database_1.default.query('SELECT e.apellido, e.nombre, e.cedula, e.codigo, sc.aprobada, sc.id, sc.id_empleado, sc.fecha, sc.observacion, ' +
                'sc.fec_comida, sc.hora_inicio, sc.hora_fin, sc.aprobada, sc.verificar, ' +
                'ctc.id AS id_menu, ctc.nombre AS nombre_menu, tc.id AS id_servicio, tc.nombre AS nombre_servicio, ' +
                'dm.id AS id_detalle, dm.valor, dm.nombre AS nombre_plato, dm.observacion AS observa_menu, sc.extra ' +
                'FROM solicita_comidas AS sc, cg_tipo_comidas AS ctc, tipo_comida AS tc, detalle_menu AS dm, empleados AS e ' +
                'WHERE ctc.tipo_comida = tc.id AND sc.verificar = \'NO\' AND e.id = sc.id_empleado AND ' +
                'ctc.id = dm.id_menu AND sc.id_comida = dm.id ORDER BY sc.fec_comida DESC');
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    EncontrarSolicitaComidaAprobada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN_COMIDAS = yield database_1.default.query('SELECT e.apellido, e.nombre, e.cedula, e.codigo, sc.aprobada, sc.id, sc.id_empleado, sc.fecha, sc.observacion, ' +
                'sc.fec_comida, sc.hora_inicio, sc.hora_fin, sc.aprobada, sc.verificar, ' +
                'ctc.id AS id_menu, ctc.nombre AS nombre_menu, tc.id AS id_servicio, tc.nombre AS nombre_servicio, ' +
                'dm.id AS id_detalle, dm.valor, dm.nombre AS nombre_plato, dm.observacion AS observa_menu, sc.extra ' +
                'FROM solicita_comidas AS sc, cg_tipo_comidas AS ctc, tipo_comida AS tc, detalle_menu AS dm, empleados AS e ' +
                'WHERE ctc.tipo_comida = tc.id AND (sc.aprobada = true OR sc.aprobada = false) AND e.id = sc.id_empleado AND ' +
                'ctc.id = dm.id_menu AND sc.id_comida = dm.id ORDER BY sc.fec_comida DESC');
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    CrearSolicitaComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, verificar } = req.body;
            yield database_1.default.query('INSERT INTO solicita_comidas (id_empleado, fecha, id_comida, observacion, fec_comida, ' +
                'hora_inicio, hora_fin, extra, verificar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id_empleado, fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, verificar]);
            res.jsonp({ message: 'Solicitud de alimentación ha sido guardada con éxito' });
        });
    }
    ActualizarSolicitaComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, id } = req.body;
            yield database_1.default.query('UPDATE solicita_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, ' +
                'observacion = $4, fec_comida = $5, hora_inicio = $6, hora_fin = $7, extra = $8 ' +
                'WHERE id = $9', [id_empleado, fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, id]);
            res.jsonp({ message: 'Solicitud de alimentación ha sido guardada con éxito' });
        });
    }
    ActualizarEstadoSolicitaComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { aprobada, verificar, id } = req.body;
            yield database_1.default.query('UPDATE solicita_comidas SET aprobada = $1, verificar = $2 ' +
                'WHERE id = $3', [aprobada, verificar, id]);
            res.jsonp({ message: 'Solicitud de alimentación ha sido guardada con éxito' });
        });
    }
    EncontrarSolicitaComidaIdEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const PLAN_COMIDAS = yield database_1.default.query('SELECT sc.verificar, sc.aprobada, sc.id, sc.id_empleado, sc.fecha, sc.observacion, ' +
                'sc.fec_comida, sc.hora_inicio, sc.hora_fin, ' +
                'ctc.id AS id_menu, ctc.nombre AS nombre_menu, tc.id AS id_servicio, tc.nombre AS nombre_servicio, ' +
                'dm.id AS id_detalle, dm.valor, dm.nombre AS nombre_plato, dm.observacion AS observa_menu, sc.extra ' +
                'FROM solicita_comidas AS sc, cg_tipo_comidas AS ctc, tipo_comida AS tc, detalle_menu AS dm ' +
                'WHERE sc.id_empleado = $1 AND ctc.tipo_comida = tc.id AND ' +
                'ctc.id = dm.id_menu AND sc.id_comida = dm.id ORDER BY sc.fec_comida DESC', [id_empleado]);
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    /** ENVIAR CORRE ELECTRÓNICO INDICANDO QUE SE HA REALIZADO UNA SOLICITUD DE COMIDA */
    EnviarCorreoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            settingsMail_1.Credenciales(req.id_empresa);
            const { id_usua_solicita, correo, comida_mail, comida_noti } = req.body;
            const EMPLEADO_SOLICITA = yield database_1.default.query('SELECT e.id, e.correo, e.nombre, e.apellido, e.cedula ' +
                'FROM empleados AS e WHERE e.id = $1', [id_usua_solicita]);
            console.log(EMPLEADO_SOLICITA.rows);
            var url = `${process.env.URL_DOMAIN}/verEmpleado`;
            let data = {
                to: correo,
                from: settingsMail_1.email,
                subject: 'Solicitud de Servicio de Alimentación',
                html: `<p><b>${EMPLEADO_SOLICITA.rows[0].nombre} ${EMPLEADO_SOLICITA.rows[0].apellido}</b> con número de
          cédula ${EMPLEADO_SOLICITA.rows[0].cedula} realizó una solicitud de Servicio de Alimentación. </p>
          <a href="${url}/${id_usua_solicita}">Ir a ver solicitud</a>`
            };
            if (comida_mail === true && comida_noti === true) {
                settingsMail_1.enviarMail(data);
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: true });
            }
            else if (comida_mail === true && comida_noti === false) {
                settingsMail_1.enviarMail(data);
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: false });
            }
            else if (comida_mail === false && comida_noti === true) {
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: true });
            }
            else if (comida_mail === false && comida_noti === false) {
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: false });
            }
        });
    }
    /** BUSCAR JEFES DE DEPARTAMENTOS */
    BuscarJefes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_departamento } = req.params;
            const JefesDepartamentos = yield database_1.default.query('SELECT da.id, da.estado, cg.id AS id_dep, cg.depa_padre, ' +
                'cg.nivel, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ' +
                'ecn.id AS contrato, e.id AS empleado, e.nombre, e.apellido, e.cedula, e.correo, c.comida_mail, ' +
                'c.comida_noti ' +
                'FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, ' +
                'empl_contratos AS ecn, empleados AS e, config_noti AS c ' +
                'WHERE da.id_departamento = $1 AND da.estado = true AND da.id_empl_cargo = ecr.id AND ' +
                'da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ' +
                'ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id AND e.id = c.id_empleado', [id_departamento])
                .then(result => {
                return result.rows;
            });
            if (JefesDepartamentos.length === 0)
                return res.jsonp({ message: 'Departamento sin nadie a cargo' });
            let depa_padre = JefesDepartamentos[0].depa_padre;
            let JefeDepaPadre;
            if (depa_padre !== null) {
                do {
                    JefeDepaPadre = yield database_1.default.query('SELECT da.id, da.estado, cg.id AS id_dep, cg.depa_padre, cg.nivel, ' +
                        's.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, ' +
                        'e.id AS empleado, e.nombre, e.apellido, e.cedula, e.correo, c.comida_mail, c.comida_noti  ' +
                        'FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, ' +
                        'empl_contratos AS ecn, empleados AS e, config_noti AS c WHERE da.id_departamento = $1 AND ' +
                        'da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ' +
                        'ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id AND e.id = c.id_empleado', [depa_padre])
                        .then(result => {
                        return result.rows;
                    });
                    if (JefeDepaPadre.length === 0) {
                        depa_padre = null;
                    }
                    else {
                        depa_padre = JefeDepaPadre[0].depa_padre;
                        JefesDepartamentos.push(JefeDepaPadre[0]);
                    }
                } while (depa_padre !== null);
                return res.jsonp(JefesDepartamentos);
            }
            else {
                return res.jsonp(JefesDepartamentos);
            }
        });
    }
    /** PLANIFICACIÓN DE COMIDAS */
    ListarPlanComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN_COMIDAS = yield database_1.default.query('SELECT * FROM plan_comidas');
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearPlanComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, fec_inicio, fec_final } = req.body;
            yield database_1.default.query('INSERT INTO plan_comidas (fecha, id_comida, observacion, fec_comida, ' +
                'hora_inicio, hora_fin, extra, fec_inicio, fec_final) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, fec_inicio, fec_final]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardada con éxito' });
        });
    }
    ObtenerUltimaPlanificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN_COMIDAS = yield database_1.default.query('SELECT MAX(id) AS ultimo FROM plan_comidas');
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    EncontrarPlanComidaIdEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const PLAN_COMIDAS = yield database_1.default.query('SELECT pc.id, pce.id_empleado, pc.fecha, pc.observacion, ' +
                'pc.fec_comida, pc.hora_inicio, pc.hora_fin, ' +
                'ctc.id AS id_menu, ctc.nombre AS nombre_menu, tc.id AS id_servicio, tc.nombre AS nombre_servicio, ' +
                'dm.id AS id_detalle, dm.valor, dm.nombre AS nombre_plato, dm.observacion AS observa_menu, pc.extra ' +
                'FROM plan_comidas AS pc, plan_comida_empleado AS pce, cg_tipo_comidas AS ctc, tipo_comida AS tc, ' +
                'detalle_menu AS dm WHERE pce.id_empleado = $1 AND ctc.tipo_comida = tc.id AND ' +
                'ctc.id = dm.id_menu AND pc.id_comida = dm.id AND pc.id = pce.id_plan_comida ' +
                'ORDER BY pc.fec_comida DESC', [id_empleado]);
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM plan_comidas WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
    ActualizarPlanComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, id } = req.body;
            yield database_1.default.query('UPDATE plan_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, ' +
                'observacion = $4, fec_comida = $5, hora_inicio = $6, hora_fin = $7, extra = $8 ' +
                'WHERE id = $9', [fecha, id_comida, observacion, fec_comida, hora_inicio, hora_fin, extra, id]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
        });
    }
    /** REGISTRO DE LA PLANIFICACIÓN DE ALIMENTACIÓN AL EMPLEADO */
    CrearPlanEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo, id_empleado, id_plan_comida, fecha, hora_inicio, hora_fin, consumido } = req.body;
            yield database_1.default.query('INSERT INTO plan_comida_empleado (codigo, id_empleado, id_plan_comida, fecha, ' +
                'hora_inicio, hora_fin, consumido ) VALUES ($1, $2, $3, $4, $5, $6, $7)', [codigo, id_empleado, id_plan_comida, fecha, hora_inicio, hora_fin, consumido]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardada con éxito' });
        });
    }
    /** TABLA TIPO COMIDAS */
    ListarTipoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN_COMIDAS = yield database_1.default.query('SELECT * FROM tipo_comida');
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearTipoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.body;
            yield database_1.default.query('INSERT INTO tipo_comida (nombre) VALUES ($1)', [nombre]);
            res.jsonp({ message: 'Tipo comida ha sido guardado con éxito' });
        });
    }
    VerUltimoTipoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN_COMIDAS = yield database_1.default.query('SELECT MAX(id) FROM tipo_comida');
            if (PLAN_COMIDAS.rowCount > 0) {
                return res.jsonp(PLAN_COMIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    /** NOTIFICACIONES DE SOLIICTUDES Y PLANIFICACIÓN DE SERVICIO DE ALIMENTACIÓN*/
    EnviarNotificacionPlanComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id_empl_envia, id_empl_recive, mensaje } = req.body;
            var f = new Date();
            f.setUTCHours(f.getHours());
            let create_at = f.toJSON();
            let tipo = 1; // Es el tipo de notificación
            yield database_1.default.query('INSERT INTO realtime_timbres(create_at, id_send_empl, id_receives_empl, descripcion, tipo) VALUES($1, $2, $3, $4, $5)', [create_at, id_empl_envia, id_empl_recive, mensaje, tipo]);
            res.jsonp({ message: 'Se envio notificacion y correo electrónico.' });
        });
    }
    /** ENVIAR CORRE ELECTRÓNICO INDICANDO QUE SE HA REALIZADO UNA PLANIFICACIÓN DE COMIDA */
    EnviarCorreoPlanComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            settingsMail_1.Credenciales(req.id_empresa);
            const { id_usua_plan, id_usu_admin, fecha, hora_inicio, hora_fin } = req.body;
            const EMPLEADO_PLAN = yield database_1.default.query('SELECT e.nombre, e.apellido, e.cedula, e.correo, c.comida_mail, ' +
                'c.comida_noti FROM empleados AS e, config_noti AS c ' +
                'WHERE e.id = $1 AND e.id = c.id_empleado', [id_usua_plan]);
            const EMPLEADO_ADMIN = yield database_1.default.query('SELECT e.id, e.correo, e.nombre, e.apellido, e.cedula ' +
                'FROM empleados AS e WHERE e.id = $1', [id_usu_admin]);
            var url = `${process.env.URL_DOMAIN}/almuerzosEmpleado`;
            let data = {
                to: EMPLEADO_PLAN.rows[0].correo,
                from: settingsMail_1.email,
                subject: 'Planificación de Servicio de Alimentación',
                html: `<p><b>${EMPLEADO_ADMIN.rows[0].nombre} ${EMPLEADO_ADMIN.rows[0].apellido}</b> ha realizado una
      Planificación de Servicio de Alimentación para el <b>${fecha}</b> a partir de las <b>${hora_inicio}</b> hasta <b>${hora_fin}</b>, 
      a usted <b>${EMPLEADO_PLAN.rows[0].nombre} ${EMPLEADO_PLAN.rows[0].apellido}</b> con cédula de 
      identidad <b>${EMPLEADO_PLAN.rows[0].cedula}</b>. </p>
          <a href="${url}">Ir a ver Planificación</a>`
            };
            if (EMPLEADO_PLAN.rows[0].comida_mail === true && EMPLEADO_PLAN.rows[0].comida_noti === true) {
                settingsMail_1.enviarMail(data);
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: true });
            }
            else if (EMPLEADO_PLAN.rows[0].comida_mail === true && EMPLEADO_PLAN.rows[0].comida_noti === false) {
                settingsMail_1.enviarMail(data);
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: false });
            }
            else if (EMPLEADO_PLAN.rows[0].comida_mail === false && EMPLEADO_PLAN.rows[0].comida_noti === true) {
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: true });
            }
            else if (EMPLEADO_PLAN.rows[0].comida_mail === false && EMPLEADO_PLAN.rows[0].comida_noti === false) {
                res.jsonp({ message: 'Solicitud se notificó con éxito', notificacion: false });
            }
        });
    }
}
exports.PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();
exports.default = exports.PLAN_COMIDAS_CONTROLADOR;
