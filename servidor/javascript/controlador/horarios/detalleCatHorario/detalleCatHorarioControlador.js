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
class DetalleCatalogoHorarioControlador {
    ListarDetalleHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIO = yield database_1.default.query('SELECT * FROM deta_horarios');
            if (HORARIO.rowCount > 0) {
                return res.json(HORARIO.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearDetalleHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orden, hora, minu_espera, nocturno, id_horario, tipo_accion } = req.body;
            yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minu_espera, nocturno, id_horario, tipo_accion]);
            res.json({ message: 'Detalle de Horario se registró con éxito' });
        });
    }
    ListarUnDetalleHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_horario } = req.params;
            const HORARIO = yield database_1.default.query('SELECT * FROM deta_horarios WHERE id_horario = $1', [id_horario]);
            if (HORARIO.rowCount > 0) {
                return res.json(HORARIO.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
}
exports.DETALLE_CATALOGO_HORARIO_CONTROLADOR = new DetalleCatalogoHorarioControlador();
exports.default = exports.DETALLE_CATALOGO_HORARIO_CONTROLADOR;
