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
class ProvinciaControlador {
    ListarProvincia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PROVINCIA = yield database_1.default.query('SELECT * FROM cg_provincias ORDER BY nombre, pais ASC');
            if (PROVINCIA.rowCount > 0) {
                return res.json(PROVINCIA.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnaProvincia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const UNA_PROVINCIA = yield database_1.default.query('SELECT * FROM cg_provincias WHERE id = $1', [id]);
            if (UNA_PROVINCIA.rowCount > 0) {
                return res.json(UNA_PROVINCIA.rows);
            }
            else {
                return res.status(404).json({ text: 'La provincia no ha sido encontrada' });
            }
        });
    }
    CrearProvincia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, pais } = req.body;
            yield database_1.default.query('INSERT INTO cg_provincias (nombre, pais) VALUES ($1, $2)', [nombre, pais]);
            res.json({ message: 'La provincia ha sido guardada con éxito' });
        });
    }
}
exports.PROVINCIA_CONTROLADOR = new ProvinciaControlador();
exports.default = exports.PROVINCIA_CONTROLADOR;
