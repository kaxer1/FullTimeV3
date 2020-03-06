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
                res.json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const FERIADOS = yield database_1.default.query('SELECT * FROM cg_feriados WHERE id = $1', [id]);
            if (FERIADOS.rowCount > 0) {
                return res.json(FERIADOS.rows);
            }
            else {
                res.json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearFeriados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha, descripcion, fec_recuperacion } = req.body;
            yield database_1.default.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
            console.log(req.body);
            res.json({ message: 'Feriado guardado' });
        });
    }
}
const FERIADOS_CONTROLADOR = new FeriadosControlador();
exports.default = FERIADOS_CONTROLADOR;
