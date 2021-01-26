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
class AlimentacionControlador {
    ListarPlanificadosConsumidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_inicio, fec_final } = req.body;
            const DATOS = yield database_1.default.query('SELECT COUNT(ctc.nombre) AS cantidad, pc.id_comida, ctc.nombre, ' +
                'ctc.valor, (COUNT(ctc.nombre) * ctc.valor) AS total, tc.nombre AS tipo ' +
                'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
                'WHERE ctc.id = pc.id_comida AND tc.id = pc.tipo_comida AND pc.consumido = true AND ' +
                'pc.descripcion = \'Planificacion\' AND pc.extra = false AND pc.fecha BETWEEN $1 AND $2 ' +
                'GROUP BY pc.id_comida, ctc.nombre, ctc.valor, tc.nombre', [fec_inicio, fec_final]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarSolicitadosConsumidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_inicio, fec_final } = req.body;
            const DATOS = yield database_1.default.query('SELECT COUNT(ctc.nombre) AS cantidad, pc.id_comida, ctc.nombre, ' +
                'ctc.valor, (COUNT(ctc.nombre) * ctc.valor) AS total, tc.nombre AS tipo ' +
                'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
                'WHERE ctc.id = pc.id_comida AND tc.id = pc.tipo_comida AND pc.consumido = true AND ' +
                'pc.descripcion = \'Solicitud\' AND pc.extra = false AND pc.fecha BETWEEN $1 AND $2 ' +
                'GROUP BY pc.id_comida, ctc.nombre, ctc.valor, tc.nombre', [fec_inicio, fec_final]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarExtrasConsumidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_inicio, fec_final } = req.body;
            const DATOS = yield database_1.default.query('SELECT COUNT(ctc.nombre) AS cantidad, pc.id_comida, ctc.nombre, ' +
                'ctc.valor, (COUNT(ctc.nombre) * ctc.valor) AS total, tc.nombre AS tipo ' +
                'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
                'WHERE ctc.id = pc.id_comida AND tc.id = pc.tipo_comida AND pc.consumido = true AND pc.extra = true ' +
                'AND pc.fecha BETWEEN $1 AND $2 ' +
                'GROUP BY pc.id_comida, ctc.nombre, ctc.valor, tc.nombre', [fec_inicio, fec_final]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
}
exports.ALIMENTACION_CONTROLADOR = new AlimentacionControlador();
exports.default = exports.ALIMENTACION_CONTROLADOR;
