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
            const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, descripcion, extra } = req.body;
            yield database_1.default.query('INSERT INTO plan_comidas (id_empleado, fecha, id_comida, observacion, fec_solicita, ' +
                'hora_inicio, hora_fin, descripcion, extra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin,
                descripcion, extra]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
        });
    }
    EncontrarPlanComidaPorIdEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const PLAN_COMIDAS = yield database_1.default.query('SELECT pc.id, pc.id_empleado, pc.fecha, pc.observacion, ' +
                'pc.fec_solicita, pc.hora_inicio, pc.hora_fin, pc.descripcion, ' +
                'ctc.id AS id_menu, ctc.nombre AS nombre_menu, tc.id AS id_servicio, tc.nombre AS nombre_servicio, ' +
                'dm.id AS id_detalle, dm.valor, dm.nombre AS nombre_plato, dm.observacion AS observa_menu, pc.extra ' +
                'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc, detalle_menu AS dm ' +
                'WHERE pc.id_empleado = $1 AND ctc.tipo_comida = tc.id AND ' +
                'ctc.id = dm.id_menu AND pc.id_comida = dm.id', [id_empleado]);
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
            const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, extra, id } = req.body;
            yield database_1.default.query('UPDATE plan_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, ' +
                'observacion = $4, fec_solicita = $5, hora_inicio = $6, hora_fin = $7, extra = $8 ' +
                'WHERE id = $9', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, extra, id]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
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
    // Alertas notificación y envio a correo electrónico
    EnviarCorreoPlanComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            settingsMail_1.Credenciales(req.id_empresa);
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
                subject: 'Servicio de Alimentación',
                html: `<p><h4><b>${Envia.nombre} ${Envia.apellido}</b> </h4> escribe: <b>${mensaje}</b> 
            <h4>A usted: <b>${Recibe.nombre} ${Recibe.apellido} </b></h4>
            `
            };
            settingsMail_1.enviarMail(data);
            res.jsonp({ message: 'Se envio notificacion y correo electrónico.' });
        });
    }
}
exports.PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();
exports.default = exports.PLAN_COMIDAS_CONTROLADOR;
