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
class NivelTituloControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const titulo = yield database_1.default.query('SELECT * FROM nivel_titulo');
            res.json(titulo.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const unNivelTitulo = yield database_1.default.query('SELECT * FROM nivel_titulo WHERE id = $1', [id]);
            if (unNivelTitulo.rowCount > 0) {
                return res.json(unNivelTitulo.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
    ObtenerNivelNombre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const unNivelTitulo = yield database_1.default.query('SELECT * FROM nivel_titulo WHERE nombre = $1', [nombre]);
            if (unNivelTitulo.rowCount > 0) {
                return res.json(unNivelTitulo.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.body;
            yield database_1.default.query('INSERT INTO nivel_titulo ( nombre ) VALUES ($1)', [nombre]);
            res.json({ message: 'Nivel del Titulo guardado' });
        });
    }
    ActualizarNivelTitulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, id } = req.body;
            yield database_1.default.query('UPDATE nivel_titulo SET nombre = $1 WHERE id = $2', [nombre, id]);
            res.json({ message: 'Nivel de Título actualizado exitosamente' });
        });
    }
}
exports.NIVEL_TITULO_CONTROLADOR = new NivelTituloControlador();
exports.default = exports.NIVEL_TITULO_CONTROLADOR;
