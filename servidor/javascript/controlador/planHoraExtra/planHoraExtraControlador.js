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
            const PLAN = yield database_1.default.query('SELECT * FROM plan_hora_extra ORDER BY fecha_desde ASC');
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
}
exports.PLAN_HORA_EXTRA_CONTROLADOR = new PlanHoraExtraControlador();
exports.default = exports.PLAN_HORA_EXTRA_CONTROLADOR;
