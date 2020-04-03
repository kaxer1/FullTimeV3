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
class CiudadFeriadoControlador {
    AsignarCiudadFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_feriado, id_ciudad } = req.body;
            yield database_1.default.query('INSERT INTO ciud_feriados (id_feriado, id_ciudad) VALUES ($1, $2)', [id_feriado, id_ciudad]);
            res.json({ message: 'Ciudad asignada a feriado' });
        });
    }
    ObtenerIdCiudades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_feriado, id_ciudad } = req.body;
            const CIUDAD_FERIADO = yield database_1.default.query('SELECT * FROM ciud_feriados WHERE id_feriado = $1 AND id_ciudad = $2', [id_feriado, id_ciudad]);
            if (CIUDAD_FERIADO.rowCount > 0) {
                return res.json(CIUDAD_FERIADO.rows);
            }
            else {
                return res.status(404).json({ text: 'Registros no encontrados' });
            }
        });
    }
    FiltrarCiudadesProvincia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const CIUDAD_FERIADO = yield database_1.default.query('SELECT id, descripcion FROM VistaNombreProvincia WHERE nombre = $1', [nombre]);
            if (CIUDAD_FERIADO.rowCount > 0) {
                return res.json(CIUDAD_FERIADO.rows);
            }
            else {
                return res.status(404).json({ text: 'Registros no encontrados' });
            }
        });
    }
    ObtenerProvincia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const CIUDAD_FERIADO = yield database_1.default.query('SELECT * FROM VistaNombreProvincia');
            if (CIUDAD_FERIADO.rowCount > 0) {
                return res.json(CIUDAD_FERIADO.rows);
            }
            else {
                return res.status(404).json({ text: 'Registros no encontrados' });
            }
        });
    }
}
exports.CIUDAD_FERIADO_CONTROLADOR = new CiudadFeriadoControlador();
exports.default = exports.CIUDAD_FERIADO_CONTROLADOR;
