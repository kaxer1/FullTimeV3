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
class EnroladoControlador {
    ListarEnrolados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ENROLADOS = yield database_1.default.query('SELECT * FROM cg_enrolados');
            if (ENROLADOS.rowCount > 0) {
                return res.json(ENROLADOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnEnrolado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const ENROLADOS = yield database_1.default.query('SELECT * FROM cg_enrolados WHERE id = $1', [id]);
            if (ENROLADOS.rowCount > 0) {
                return res.json(ENROLADOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearEnrolado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario, nombre, contrasenia, activo, finger, data_finger } = req.body;
            yield database_1.default.query('INSERT INTO cg_enrolados (id_usuario, nombre, contrasenia, activo, finger, data_finger) VALUES ($1, $2,$3, $4, $5, $6)', [id_usuario, nombre, contrasenia, activo, finger, data_finger]);
            res.json({ message: 'Se ha añadido correctamente al catálogo enrolados' });
        });
    }
    ObtenerRegistroEnrolado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            const ENROLADOS = yield database_1.default.query('SELECT id FROM cg_enrolados WHERE id_usuario = $1', [id_usuario]);
            if (ENROLADOS.rowCount > 0) {
                return res.json(ENROLADOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se ha encontrado en el catálogo enrolados' });
            }
        });
    }
    ObtenerUltimoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ENROLADOS = yield database_1.default.query('SELECT MAX(id) FROM cg_enrolados');
            if (ENROLADOS.rowCount > 0) {
                return res.json(ENROLADOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ActualizarEnrolado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario, nombre, contrasenia, activo, finger, data_finger, id } = req.body;
            yield database_1.default.query('UPDATE cg_enrolados SET id_usuario = $1, nombre = $2, contrasenia = $3, activo = $4, finger = $5, data_finger = $6 WHERE id = $7', [id_usuario, nombre, contrasenia, activo, finger, data_finger, id]);
            res.json({ message: 'Usuario Enrolado actualizado exitosamente' });
        });
    }
    CargaPlantillaEnrolado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { id_usuario, nombre, contrasenia, activo, finger, data_finger } = data;
                if (id_usuario != undefined) {
                    yield database_1.default.query('INSERT INTO cg_enrolados (id_usuario, nombre, contrasenia, activo, finger, data_finger) VALUES ($1, $2,$3, $4, $5, $6)', [id_usuario, nombre, contrasenia, activo, finger, data_finger]);
                }
                else {
                    res.json({ error: 'plantilla equivocada' });
                }
            }));
            res.json({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
}
exports.ENROLADOS_CONTROLADOR = new EnroladoControlador();
exports.default = exports.ENROLADOS_CONTROLADOR;
