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
class TipoComidasControlador {
    ListarTipoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const TIPO_COMIDAS = yield database_1.default.query('SELECT * FROM cg_tipo_comidas');
            if (TIPO_COMIDAS.rowCount > 0) {
                return res.json(TIPO_COMIDAS.rows);
            }
            else {
                res.json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnTipoComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const TIPO_COMIDAS = yield database_1.default.query('SELECT * FROM cg_tipo_comidas WHERE id = $1', [id]);
            if (TIPO_COMIDAS.rowCount > 0) {
                return res.json(TIPO_COMIDAS.rows);
            }
            else {
                res.json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearTipoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, valor, observacion } = req.body;
            yield database_1.default.query('INSERT INTO cg_tipo_comidas (nombre, valor, observacion) VALUES ($1, $2, $3)', [nombre, valor, observacion]);
            res.json({ message: 'Tipo de comida registrada' });
        });
    }
}
const TIPO_COMIDAS_CONTROLADOR = new TipoComidasControlador();
exports.default = TIPO_COMIDAS_CONTROLADOR;
