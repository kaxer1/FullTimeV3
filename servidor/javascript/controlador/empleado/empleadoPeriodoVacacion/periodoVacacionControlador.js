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
class PeriodoVacacionControlador {
    ListarPerVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const VACACIONES = yield database_1.default.query('SELECT * FROM peri_vacaciones');
            if (VACACIONES.rowCount > 0) {
                return res.json(VACACIONES.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearPerVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido } = req.body;
            yield database_1.default.query('INSERT INTO peri_vacaciones (id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido]);
            res.json({ message: 'Período de Vacación guardado' });
        });
    }
    EncontrarIdPerVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const VACACIONES = yield database_1.default.query('SELECT pv.id FROM peri_vacaciones AS pv, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND pv.id_empl_contrato = ce.id AND e.id = $1', [id_empleado]);
            if (VACACIONES.rowCount > 0) {
                return res.json(VACACIONES.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
    EncontrarPerVacacionesPorIdContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_contrato } = req.params;
            const PERIODO_VACACIONES = yield database_1.default.query('SELECT * FROM peri_vacaciones AS p WHERE p.id_empl_contrato = $1', [id_empl_contrato]);
            if (PERIODO_VACACIONES.rowCount > 0) {
                return res.json(PERIODO_VACACIONES.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
}
const PERIODO_VACACION_CONTROLADOR = new PeriodoVacacionControlador();
exports.default = PERIODO_VACACION_CONTROLADOR;