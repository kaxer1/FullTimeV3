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
            const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, descripcion, tipo_comida, extra } = req.body;
            yield database_1.default.query('INSERT INTO plan_comidas (id_empleado, fecha, id_comida, observacion, fec_solicita, ' +
                'hora_inicio, hora_fin, descripcion, tipo_comida, extra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin,
                descripcion, tipo_comida, extra]);
            res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
        });
    }
    EncontrarPlanComidaPorIdEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const PLAN_COMIDAS = yield database_1.default.query('SELECT pc.id, pc.id_empleado, pc.fecha, pc.observacion, ' +
                'pc.fec_solicita, pc.hora_inicio, pc.hora_fin, pc.descripcion, ct.id AS id_tipo_comida, ct.nombre, ' +
                'ct.valor, s.nombre AS tipo_servicio, s.id AS id_servicio, pc.extra FROM plan_comidas AS pc, cg_tipo_comidas AS ct, tipo_comida AS s ' +
                'WHERE pc.id_empleado = $1 AND ' +
                'pc.id_comida = ct.id AND s.id = pc.tipo_comida', [id_empleado]);
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
            const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, tipo_comida, extra, id } = req.body;
            yield database_1.default.query('UPDATE plan_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, ' +
                'observacion = $4, fec_solicita = $5, hora_inicio = $6, hora_fin = $7, tipo_comida = $8, extra = $9 ' +
                'WHERE id = $10', [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, tipo_comida, extra, id]);
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
}
exports.PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();
exports.default = exports.PLAN_COMIDAS_CONTROLADOR;
