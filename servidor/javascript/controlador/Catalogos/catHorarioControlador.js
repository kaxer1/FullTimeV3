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
class HorarioControlador {
    ListarHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIOS = yield database_1.default.query('SELECT * FROM cg_horarios ORDER BY nombre ASC');
            if (HORARIOS.rowCount > 0) {
                return res.json(HORARIOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const UN_HORARIO = yield database_1.default.query('SELECT * FROM cg_horarios WHERE id = $1', [id]);
            if (UN_HORARIO.rowCount > 0) {
                return res.json(UN_HORARIO.rows);
            }
            res.status(404).json({ text: 'No se encuentran registros' });
        });
    }
    CrearHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //HORA_TRABAJO --SOLO PERMITE 2 Nùmeros 1 entero, un decimal 
            const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas } = req.body;
            yield database_1.default.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo,flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas]);
            res.json({ message: 'El horario ha sido registrado' });
        });
    }
}
exports.HORARIO_CONTROLADOR = new HorarioControlador();
exports.default = exports.HORARIO_CONTROLADOR;
