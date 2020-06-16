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
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
class RelojesControlador {
    ListarRelojes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const RELOJES = yield database_1.default.query('SELECT * FROM NombreDispositivos');
            if (RELOJES.rowCount > 0) {
                return res.jsonp(RELOJES.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnReloj(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const RELOJES = yield database_1.default.query('SELECT * FROM cg_relojes WHERE id = $1', [id]);
            if (RELOJES.rowCount > 0) {
                return res.jsonp(RELOJES.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearRelojes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento } = req.body;
            yield database_1.default.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento]);
            res.jsonp({ message: 'Reloj Guardado' });
        });
    }
    ActualizarReloj(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento, id } = req.body;
            yield database_1.default.query('UPDATE cg_relojes SET nombre = $1, ip = $2, puerto = $3, contrasenia = $4, marca = $5, modelo = $6, serie = $7, id_fabricacion = $8, fabricante = $9, mac = $10, tien_funciones = $11, id_sucursal = $12, id_departamento = $13 WHERE id = $14', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento, id]);
            res.jsonp({ message: 'Registro Actualizado' });
        });
    }
    CargaPlantillaRelojes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento } = data;
                if (nombre != undefined) {
                    console.log(data);
                    yield database_1.default.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento]);
                }
                else {
                    res.jsonp({ error: 'plantilla equivocada' });
                }
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
}
const RELOJES_CONTROLADOR = new RelojesControlador();
exports.default = RELOJES_CONTROLADOR;
