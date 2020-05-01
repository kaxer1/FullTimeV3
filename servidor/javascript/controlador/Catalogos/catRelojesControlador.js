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
class RelojesControlador {
    ListarRelojes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const RELOJES = yield database_1.default.query('SELECT * FROM NombreDispositivos');
            if (RELOJES.rowCount > 0) {
                return res.json(RELOJES.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnReloj(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const RELOJES = yield database_1.default.query('SELECT * FROM cg_relojes WHERE id = $1', [id]);
            if (RELOJES.rowCount > 0) {
                return res.json(RELOJES.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearRelojes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento } = req.body;
            yield database_1.default.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento]);
            res.json({ message: 'Reloj Guardado' });
        });
    }
}
const RELOJES_CONTROLADOR = new RelojesControlador();
exports.default = RELOJES_CONTROLADOR;
