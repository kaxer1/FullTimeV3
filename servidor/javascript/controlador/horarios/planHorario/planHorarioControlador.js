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
class PlanHorarioControlador {
    ListarPlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIO = yield database_1.default.query('SELECT * FROM plan_horarios');
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearPlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_cargo, fec_inicio, fec_final } = req.body;
            yield database_1.default.query('INSERT INTO plan_horarios ( id_cargo, fec_inicio, fec_final ) VALUES ($1, $2, $3)', [id_cargo, fec_inicio, fec_final]);
            res.jsonp({ message: 'Plan Horario Registrado' });
        });
    }
    EncontrarIdPlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const HORARIO = yield database_1.default.query('SELECT ph.id FROM plan_horarios AS ph, empl_cargos AS ecargo, empl_contratos AS contratoe, empleados AS e WHERE ph.id_cargo = ecargo.id AND ecargo.id_empl_contrato = contratoe.id AND contratoe.id_empleado = e.id AND e.id = $1', [id_empleado]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarPlanHorarioPorIdCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_cargo } = req.params;
            const HORARIO_CARGO = yield database_1.default.query('SELECT * FROM plan_horarios AS p WHERE p.id_cargo = $1', [id_cargo]);
            if (HORARIO_CARGO.rowCount > 0) {
                return res.jsonp(HORARIO_CARGO.rows);
            }
            else {
                res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarPlanHorarioPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const HORARIO_CARGO = yield database_1.default.query('SELECT * FROM plan_horarios AS p WHERE p.id = $1', [id]);
            if (HORARIO_CARGO.rowCount > 0) {
                return res.jsonp(HORARIO_CARGO.rows);
            }
            else {
                res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    ActualizarPlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_cargo, fec_inicio, fec_final, id } = req.body;
            yield database_1.default.query('UPDATE plan_horarios SET id_cargo = $1, fec_inicio = $2, fec_final = $3 WHERE id = $4', [id_cargo, fec_inicio, fec_final, id]);
            res.jsonp({ message: 'Registro Actualizado' + id, });
        });
    }
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM plan_horarios WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
}
exports.PLAN_HORARIO_CONTROLADOR = new PlanHorarioControlador();
exports.default = exports.PLAN_HORARIO_CONTROLADOR;
