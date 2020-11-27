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
const database_1 = __importDefault(require("../../../database"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
class DetalleCatalogoHorarioControlador {
    ListarDetalleHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIO = yield database_1.default.query('SELECT * FROM deta_horarios');
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearDetalleHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orden, hora, minu_espera, id_horario, tipo_accion } = req.body;
            yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5)', [orden, hora, minu_espera, id_horario, tipo_accion]);
            res.jsonp({ message: 'Detalle de Horario se registró con éxito' });
        });
    }
    ListarUnDetalleHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_horario } = req.params;
            const HORARIO = yield database_1.default.query('SELECT * FROM deta_horarios WHERE id_horario = $1', [id_horario]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearHorarioDetallePlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                var { nombre_horario, orden, hora, nocturno, tipo_accion, minutos_espera } = data;
                console.log("datos", data);
                var nombre = nombre_horario;
                console.log("datos", nombre);
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
                var id_horario = idHorario.rows[0]['id'];
                console.log("horarios", idHorario.rows);
                if (minutos_espera != undefined) {
                    yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
                }
                else {
                    minutos_espera = 0;
                    yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
                }
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
    ActualizarDetalleHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orden, hora, minu_espera, id_horario, tipo_accion, id } = req.body;
            yield database_1.default.query('UPDATE deta_horarios SET orden = $1, hora = $2, minu_espera = $3, id_horario = $4, tipo_accion = $5 WHERE id = $6', [orden, hora, minu_espera, id_horario, tipo_accion, id]);
            res.jsonp({ message: 'Detalle de Horario se registró con éxito' });
        });
    }
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM deta_horarios WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
}
exports.DETALLE_CATALOGO_HORARIO_CONTROLADOR = new DetalleCatalogoHorarioControlador();
exports.default = exports.DETALLE_CATALOGO_HORARIO_CONTROLADOR;
