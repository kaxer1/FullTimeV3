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
class HorasExtrasControlador {
    ListarHorasExtras(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORAS_EXTRAS = yield database_1.default.query('SELECT * FROM cg_hora_extras');
            if (HORAS_EXTRAS.rowCount > 0) {
                return res.json(HORAS_EXTRAS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnaHoraExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const HORAS_EXTRAS = yield database_1.default.query('SELECT * FROM cg_hora_extras WHERE id = $1', [id]);
            if (HORAS_EXTRAS.rowCount > 0) {
                return res.json(HORAS_EXTRAS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearHoraExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion } = req.body;
            yield database_1.default.query('INSERT INTO cg_hora_extras ( descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion]);
            res.json({ message: 'Hora extra guardada' });
        });
    }
}
exports.horaExtraControlador = new HorasExtrasControlador();
exports.default = exports.horaExtraControlador;
