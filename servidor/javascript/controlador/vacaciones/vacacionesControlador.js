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
class VacacionesControlador {
    ListarVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const VACACIONES = yield database_1.default.query('SELECT *FROM vacaciones');
            if (VACACIONES.rowCount > 0) {
                return res.json(VACACIONES.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion } = req.body;
            yield database_1.default.query('INSERT INTO vacaciones (fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion]);
            res.json({ message: 'Vacaciones guardadas con éxito' });
        });
    }
}
exports.VACACIONES_CONTROLADOR = new VacacionesControlador();
exports.default = exports.VACACIONES_CONTROLADOR;
