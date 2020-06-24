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
const builder = require('xmlbuilder');
class HorarioControlador {
    ListarHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIOS = yield database_1.default.query('SELECT * FROM cg_horarios ORDER BY id');
            if (HORARIOS.rowCount > 0) {
                return res.jsonp(HORARIOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const UN_HORARIO = yield database_1.default.query('SELECT * FROM cg_horarios WHERE id = $1', [id]);
            if (UN_HORARIO.rowCount > 0) {
                return res.jsonp(UN_HORARIO.rows);
            }
            else {
                res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //HORA_TRABAJO --SOLO PERMITE 2 Nùmeros 1 entero, un decimal 
            const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre } = req.body;
            console.log({ nombre, min_almuerzo, hora_trabajo, flexible, por_horas });
            yield database_1.default.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre) VALUES ($1, $2, $3, $4, $5, $6)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre]);
            const ultimo = yield database_1.default.query('SELECT MAX(id) AS id FROM cg_horarios');
            res.jsonp({ message: 'El horario ha sido registrado', id: ultimo.rows[0].id });
        });
    }
    CrearHorarioPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                var { nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas } = data;
                //console.log("datos", data);
                //console.log("almuerzo", min_almuerzo);
                if (minutos_almuerzo != undefined) {
                    //console.log("datos", data);
                    //console.log("almuerzo", min_almuerzo);
                    yield database_1.default.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
                }
                else {
                    minutos_almuerzo = 0;
                    yield database_1.default.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
                }
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
    CrearHorarioyDetallePlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            const plantillaD = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            /** Horarios */
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                var { nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas } = data;
                if (nombre_horario != undefined) {
                    if (minutos_almuerzo != undefined) {
                        //console.log("datos", data);
                        yield database_1.default.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
                    }
                    else {
                        minutos_almuerzo = 0;
                        yield database_1.default.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre_horario, minutos_almuerzo, hora_trabajo, flexible, por_horas]);
                    }
                }
                else {
                    console.log("vacio");
                }
            }));
            console.log("termina");
            /** Detalle de Horarios */
            plantillaD.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                var { nombre_horarios, orden, hora, nocturno, tipo_accion, minutos_espera } = data;
                var nombre = nombre_horarios;
                console.log("datos", nombre);
                //console.log("datos", data)
                const horariosTotales = yield database_1.default.query('SELECT * FROM cg_horarios');
                console.log(horariosTotales.rows);
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
                var id_horario = idHorario.rows[0]['id'];
                console.log("horarios", id_horario);
                if (minutos_espera != undefined) {
                    console.log("entra");
                    yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
                }
                else {
                    minutos_espera = '00:00';
                    yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
                }
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
    EditarHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre } = req.body;
            yield database_1.default.query('UPDATE cg_horarios SET nombre = $1, min_almuerzo = $2, hora_trabajo = $3, flexible = $4, por_horas = $5, doc_nombre = $6 WHERE id = $7', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas, doc_nombre, id]);
            res.jsonp({ message: 'Tipo Permiso Actualizado' });
        });
    }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "Horarios-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
            fs_1.default.writeFile(`xmlDownload/${filename}`, xml, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Archivo guardado");
            });
            res.jsonp({ text: 'XML creado', name: filename });
        });
    }
    downloadXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.params.nameXML;
            let filePath = `servidor\\xmlDownload\\${name}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    ObtenerDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = req.params.docs;
            let filePath = `servidor\\docRespaldosHorarios\\${docs}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    GuardarDocumentoHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let doc = list.uploads[0].path.split("\\")[1];
            let id = req.params.id;
            yield database_1.default.query('UPDATE cg_horarios SET documento = $2 WHERE id = $1', [id, doc]);
            res.jsonp({ message: 'Documento Actualizado' });
        });
    }
    EditarDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { documento } = req.body;
            yield database_1.default.query('UPDATE cg_horarios SET documento = $1 WHERE id = $2', [documento, id]);
            res.jsonp({ message: 'Tipo Permiso Actualizado' });
        });
    }
}
exports.HORARIO_CONTROLADOR = new HorarioControlador();
exports.default = exports.HORARIO_CONTROLADOR;
