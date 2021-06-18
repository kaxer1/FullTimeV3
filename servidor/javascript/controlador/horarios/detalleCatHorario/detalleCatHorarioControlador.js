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
exports.DETALLE_CATALOGO_HORARIO_CONTROLADOR = void 0;
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
            const HORARIO = yield database_1.default.query('SELECT * FROM deta_horarios WHERE id_horario = $1 ORDER BY orden ASC', [id_horario])
                .then(result => {
                if (result.rowCount === 0)
                    return [];
                return result.rows.map(o => {
                    switch (o.tipo_accion) {
                        case 'E':
                            o.tipo_accion = 'Entrada';
                            break;
                        case 'S/A':
                            o.tipo_accion = 'S.Almuerzo';
                            break;
                        case 'E/A':
                            o.tipo_accion = 'E.Almuerzo';
                            break;
                        case 'S':
                            o.tipo_accion = 'Salida';
                            break;
                        default:
                            o.tipo_accion = 'codigo 99';
                            break;
                    }
                    return o;
                });
            });
            if (HORARIO.length > 0) {
                return res.jsonp(HORARIO);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    /** Verificar que el nombre del horario exista dentro del sistema */
    VerificarDatosDetalles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantillaD = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarHorario = 0;
            var contarDatos = 0;
            var contador = 1;
            /** Detalle de Horarios */
            plantillaD.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { nombre_horario, orden, hora, tipo_accion, minutos_espera } = data;
                // Verificar que los datos obligatorios existan
                if (nombre_horario != undefined && orden != undefined && hora != undefined &&
                    tipo_accion != undefined) {
                    contarDatos = contarDatos + 1;
                }
                // Verificar que exita el nombre del horario
                if (nombre_horario != undefined) {
                    const HORARIO = yield database_1.default.query('SELECT * FROM cg_horarios WHERE UPPER(nombre) = $1', [nombre_horario.toUpperCase()]);
                    if (HORARIO.rowCount != 0) {
                        contarHorario = contarHorario + 1;
                    }
                }
                //Verificar que todos los datos sean correctos
                console.log('datos', contarHorario, contarDatos);
                if (contador === plantillaD.length) {
                    if (contarHorario === plantillaD.length && contarDatos === plantillaD.length) {
                        return res.jsonp({ message: 'correcto' });
                    }
                    else {
                        return res.jsonp({ message: 'error' });
                    }
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    CrearDetallePlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantillaD = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            /** Detalle de Horarios */
            plantillaD.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                var { nombre_horario, orden, hora, tipo_accion, minutos_espera } = data;
                var nombre = nombre_horario;
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE UPPER(nombre) = $1', [nombre.toUpperCase()]);
                var id_horario = idHorario.rows[0]['id'];
                if (minutos_espera != undefined) {
                    yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5)', [orden, hora, minutos_espera, id_horario, tipo_accion.split("=")[0]]);
                    res.jsonp({ message: 'correcto' });
                }
                else {
                    minutos_espera = 0;
                    yield database_1.default.query('INSERT INTO deta_horarios (orden, hora, minu_espera, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5)', [orden, hora, minutos_espera, id_horario, tipo_accion.split("=")[0]]);
                    res.jsonp({ message: 'correcto' });
                }
            }));
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
