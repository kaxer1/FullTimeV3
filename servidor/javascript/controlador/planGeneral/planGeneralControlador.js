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
exports.PLAN_GENERAL_CONTROLADOR = void 0;
const database_1 = __importDefault(require("../../database"));
class PlanGeneralControlador {
    CrearPlanificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_hora_horario, maxi_min_espera, estado, id_det_horario, fec_horario, id_empl_cargo, tipo_entr_salida, codigo } = req.body;
            yield database_1.default.query('INSERT INTO plan_general (fec_hora_horario, maxi_min_espera, estado, id_det_horario, ' +
                'fec_horario, id_empl_cargo, tipo_entr_salida, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fec_hora_horario, maxi_min_espera, estado, id_det_horario,
                fec_horario, id_empl_cargo, tipo_entr_salida, codigo]);
            res.jsonp({ message: 'Planificación ha sido guardado con éxito' });
        });
    }
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const codigo = req.params.codigo;
            const { fec_horario } = req.body;
            yield database_1.default.query('DELETE FROM plan_general WHERE fec_horario = $1 AND codigo = $2', [fec_horario, codigo]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
}
exports.PLAN_GENERAL_CONTROLADOR = new PlanGeneralControlador();
exports.default = exports.PLAN_GENERAL_CONTROLADOR;
