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
            const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin } = req.body;
            yield database_1.default.query('INSERT INTO plan_comidas (id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
        });
    }
    EncontrarPlanComidaPorIdEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const PLAN_COMIDAS = yield database_1.default.query('SELECT pc.id, pc.id_empleado, pc.fecha, pc.observacion, pc.fec_solicita, pc.hora_inicio, pc.hora_fin, ct.id AS id_tipo_comida, ct.nombre, ct.valor FROM plan_comidas AS pc, cg_tipo_comidas AS ct WHERE pc.id_empleado = $1 AND pc.id_comida = ct.id', [id_empleado]);
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
            const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, id } = req.body;
            yield database_1.default.query('UPDATE plan_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, observacion = $4, fec_solicita = $5, hora_inicio = $6, hora_fin = $7 WHERE id = $8', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, id]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
        });
    }
}
exports.PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();
exports.default = exports.PLAN_COMIDAS_CONTROLADOR;
