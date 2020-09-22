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
class PlanHoraExtraControlador {
    ListarPlanHoraExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PLAN = yield database_1.default.query('SELECT e.id AS empl_id, e.codigo, e.cedula, e.nombre, e.apellido, ' +
                't.id_plan_extra, t.tiempo_autorizado, t.fecha_desde, t.fecha_hasta, ' +
                't.hora_inicio, t.hora_fin, (t.h_fin::interval - t.h_inicio::interval)::time AS hora_total_plan, ' +
                't.fecha_timbre, t.timbre_entrada, t.timbre_salida, ' +
                '(t.timbre_salida::interval - t.timbre_entrada::interval)::time AS hora_total_timbre ' +
                'FROM empleados AS e, (SELECT * FROM timbres_entrada_plan_hora_extra AS tehe ' +
                'FULL JOIN timbres_salida_plan_hora_extra AS tshe ' +
                'ON tehe.fecha_timbre_e = tshe.fecha_timbre AND tehe.id_empl = tshe.id_empleado) AS t ' +
                'WHERE e.id = t.id_empleado OR e.id = t.id_empl');
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
            const { id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado } = req.body;
            yield database_1.default.query('INSERT INTO plan_hora_extra (id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado]);
            res.jsonp({ message: 'Planificacion registrada' });
        });
    }
    TiempoAutorizado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const { hora } = req.body;
            console.log(id);
            console.log(hora);
            let respuesta = yield database_1.default.query('UPDATE plan_hora_extra SET tiempo_autorizado = $2 WHERE id = $1', [id, hora]).then(result => {
                return { message: 'Tiempo de hora autorizada confirmada' };
            });
            res.jsonp(respuesta);
        });
    }
}
exports.PLAN_HORA_EXTRA_CONTROLADOR = new PlanHoraExtraControlador();
exports.default = exports.PLAN_HORA_EXTRA_CONTROLADOR;
