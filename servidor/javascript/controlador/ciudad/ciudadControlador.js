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
class CiudadControlador {
    ListarNombreCiudad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const CIUDAD = yield database_1.default.query('SELECT * FROM VistaNombreProvincia ORDER BY descripcion, nombre ASC');
            if (CIUDAD.rowCount > 0) {
                return res.json(CIUDAD.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarCiudades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const CIUDAD = yield database_1.default.query('SELECT * FROM ciudades');
            if (CIUDAD.rowCount > 0) {
                return res.json(CIUDAD.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ConsularUnaCiudad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_provincia } = req.params;
            const CIUDAD = yield database_1.default.query('SELECT * FROM ciudades WHERE id_provincia = $1', [id_provincia]);
            if (CIUDAD.rowCount > 0) {
                return res.json(CIUDAD.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearCiudad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_provincia, descripcion } = req.body;
            yield database_1.default.query('INSERT INTO ciudades ( id_provincia, descripcion ) VALUES ($1, $2)', [id_provincia, descripcion]);
            res.json({ message: 'Ciudad Registrada' });
        });
    }
}
exports.CIUDAD_CONTROLADOR = new CiudadControlador();
exports.default = exports.CIUDAD_CONTROLADOR;
