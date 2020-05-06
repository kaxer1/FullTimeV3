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
const database_1 = __importDefault(require("../../../database"));
class DetallePlanHorarioControlador {
    ListarDetallePlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIO = yield database_1.default.query('SELECT * FROM plan_hora_detalles');
            if (HORARIO.rowCount > 0) {
                return res.json(HORARIO.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearDetallePlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha, id_plan_horario, tipo_dia, id_cg_horarios } = req.body;
            yield database_1.default.query('INSERT INTO plan_hora_detalles ( fecha, id_plan_horario, tipo_dia, id_cg_horarios ) VALUES ($1, $2, $3, $4)', [fecha, id_plan_horario, tipo_dia, id_cg_horarios]);
            res.json({ message: 'Detalle Plan Horario Registrado' });
        });
    }
    EncontrarPlanHoraDetallesPorIdPlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_plan_horario } = req.params;
            const HORARIO_CARGO = yield database_1.default.query('SELECT p.id, p.fecha, p.id_plan_horario, p.tipo_dia, h.nombre AS horarios FROM plan_hora_detalles AS p, cg_horarios AS h WHERE p.id_plan_horario = $1 AND p.id_cg_horarios = h.id ', [id_plan_horario]);
            if (HORARIO_CARGO.rowCount > 0) {
                return res.json(HORARIO_CARGO.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
}
exports.DETALLE_PLAN_HORARIO_CONTROLADOR = new DetallePlanHorarioControlador();
exports.default = exports.DETALLE_PLAN_HORARIO_CONTROLADOR;
