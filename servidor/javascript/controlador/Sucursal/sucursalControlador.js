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
class SucursalControlador {
    ListarSucursales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const SUCURSAL = yield database_1.default.query('SELECT *FROM NombreCiudadEmpresa');
            if (SUCURSAL.rowCount > 0) {
                return res.json(SUCURSAL.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnaSucursal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const SUCURSAL = yield database_1.default.query('SELECT * FROM sucursales WHERE id = $1', [id]);
            if (SUCURSAL.rowCount > 0) {
                return res.json(SUCURSAL.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerSucursalEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empresa } = req.params;
            const SUCURSAL = yield database_1.default.query('SELECT * FROM sucursales WHERE id_empresa = $1', [id_empresa]);
            if (SUCURSAL.rowCount > 0) {
                return res.json(SUCURSAL.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearSucursal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, id_ciudad, id_empresa } = req.body;
            yield database_1.default.query('INSERT INTO sucursales (nombre, id_ciudad, id_empresa) VALUES ($1, $2, $3)', [nombre, id_ciudad, id_empresa]);
            res.json({ message: 'Sucursal ha sido guardado con éxito' });
        });
    }
    ObtenerUltimoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const SUCURSAL = yield database_1.default.query('SELECT MAX(id) FROM sucursales');
            if (SUCURSAL.rowCount > 0) {
                return res.json(SUCURSAL.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
}
exports.SUCURSAL_CONTROLADOR = new SucursalControlador();
exports.default = exports.SUCURSAL_CONTROLADOR;
