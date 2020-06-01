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
class RegimenControlador {
    ListarRegimen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const REGIMEN = yield database_1.default.query('SELECT * FROM cg_regimenes ORDER BY descripcion ASC');
            if (REGIMEN.rowCount > 0) {
                return res.json(REGIMEN.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnRegimen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const REGIMEN = yield database_1.default.query('SELECT * FROM cg_regimenes WHERE id = $1', [id]);
            if (REGIMEN.rowCount > 0) {
                return res.json(REGIMEN.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearRegimen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion } = req.body;
            yield database_1.default.query('INSERT INTO cg_regimenes (descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7)', [descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion]);
            res.json({ message: 'Regimen guardado' });
        });
    }
    ActualizarRegimen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion, id } = req.body;
            yield database_1.default.query('UPDATE cg_regimenes  SET descripcion = $1, dia_anio_vacacion = $2, dia_incr_antiguedad = $3, anio_antiguedad = $4, dia_mes_vacacion = $5, max_dia_acumulacion = $6, dia_libr_anio_vacacion = $7 WHERE id = $8', [descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion, id]);
            res.json({ message: 'Regimen guardado' });
        });
    }
}
const REGIMEN_CONTROLADOR = new RegimenControlador();
exports.default = REGIMEN_CONTROLADOR;
