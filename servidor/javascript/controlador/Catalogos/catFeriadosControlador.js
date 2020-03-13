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
class FeriadosControlador {
    ListarFeriados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const FERIADOS = yield database_1.default.query('SELECT * FROM cg_feriados');
            if (FERIADOS.rowCount > 0) {
                return res.json(FERIADOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarFeriadoDescripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descripcion } = req.params;
            const FERIADOS = yield database_1.default.query('SELECT * FROM cg_feriados WHERE descripcion = $1', [descripcion]);
            if (FERIADOS.rowCount > 0) {
                return res.json(FERIADOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarFeriadoFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.params;
            const FERIADOS = yield database_1.default.query('SELECT * FROM cg_feriados WHERE fecha = $1', [fecha]);
            if (FERIADOS.rowCount > 0) {
                return res.json(FERIADOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ActualizarFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { fecha, descripcion, fec_recuperacion } = req.body;
            yield database_1.default.query('UPDATE cg_feriados SET fecha = $1, descripcion = $2, fec_recuperacion = $3 WHERE id = $4', [fecha, descripcion, fec_recuperacion, id]);
            res.json({ message: 'Feriado actualizado exitosamente' });
        });
    }
    CrearFeriados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha, descripcion, fec_recuperacion } = req.body;
            yield database_1.default.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
            res.json({ message: 'Feriado guardado' });
        });
    }
}
const FERIADOS_CONTROLADOR = new FeriadosControlador();
exports.default = FERIADOS_CONTROLADOR;
