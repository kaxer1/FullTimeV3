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
const builder = require('xmlbuilder');
const database_1 = __importDefault(require("../../database"));
const moment_1 = __importDefault(require("moment"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
class FeriadosControlador {
    // CONSULTA DE LISTA DE FERIADOS ORDENADOS POR SU DESCRIPCIÓN
    ListarFeriados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const FERIADOS = yield database_1.default.query('SELECT * FROM cg_feriados ORDER BY descripcion ASC');
            if (FERIADOS.rowCount > 0) {
                return res.jsonp(FERIADOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    // CONSULTA DE FERIDOS EXCEPTO EL REGISTRO QUE SE VA A ACTUALIZAR
    ListarFeriadosActualiza(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const FERIADOS = yield database_1.default.query('SELECT * FROM cg_feriados WHERE NOT id = $1', [id]);
            if (FERIADOS.rowCount > 0) {
                return res.jsonp(FERIADOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    // OBTENER ÚLTIMO REGISTRO DE LISTA DE FERIADOS
    ObtenerUltimoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const FERIADOS = yield database_1.default.query('SELECT MAX(id) FROM cg_feriados');
            if (FERIADOS.rowCount > 0) {
                return res.jsonp(FERIADOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    // MÉTODO PARA ACTUALIZAR UN FERIADO
    ActualizarFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha, descripcion, fec_recuperacion, id } = req.body;
                yield database_1.default.query('UPDATE cg_feriados SET fecha = $1, descripcion = $2, fec_recuperacion = $3 ' +
                    'WHERE id = $4', [fecha, descripcion, fec_recuperacion, id]);
                res.jsonp({ message: 'Feriado actualizado exitosamente' });
            }
            catch (error) {
                return res.jsonp({ message: 'error' });
            }
        });
    }
    // MÉTODO PARA CREAR REGISTRO DE FERIADO
    CrearFeriados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha, descripcion, fec_recuperacion } = req.body;
                yield database_1.default.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) ' +
                    'VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
                res.jsonp({ message: 'Feriado guardado' });
            }
            catch (error) {
                return res.jsonp({ message: 'error' });
            }
        });
    }
    // CONSULTA DE DATOS DE UN REGISTRO DE FERIADO
    ObtenerUnFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const FERIADO = yield database_1.default.query('SELECT * FROM cg_feriados WHERE id = $1', [id]);
            if (FERIADO.rowCount > 0) {
                return res.jsonp(FERIADO.rows);
            }
            res.status(404).jsonp({ text: 'Registros no encontrados' });
        });
    }
    // INGRESAR DATOS DE FERIADOS MEDIANTE PLANTILLA
    CrearFeriadoPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            var contador = 1;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            // LECTURA DE DATOS DE LA PLANTILLA
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { fecha, descripcion, fec_recuperacion } = data;
                // VERIFICACIÓN DE EXISTENCIA DE DATOS DE FECHA DE RECUPERACIÓN
                if (fec_recuperacion === undefined) {
                    var recuperar = null;
                }
                else {
                    recuperar = fec_recuperacion;
                }
                // REGISTRO DE DATOS EN EL SISTEMA
                yield database_1.default.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) ' +
                    'VALUES ($1, $2, $3)', [fecha, descripcion, recuperar]);
                // ENVIO DE MENSAJE UNA VEZ QUE SE HA LEIDO TODOS LOS DATOS DE LA PLANTILLA
                if (contador === plantilla.length) {
                    return res.jsonp({ message: 'CORRECTO' });
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    // MÉTODO PARA REVISAR LOS DATOS DE LA PLANTILLA DENTRO DEL SISTEMA - MENSAJES DE CADA ERROR
    RevisarDatos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            // VARIABLES USADAS PARA CONTAR NÚMERO DE FILAS CORRECTAS
            var fila = 1;
            var contador = 1;
            var existeFecha = 0;
            var existeDescripcion = 0;
            var contarRecuperacion = 0;
            var contarFecha = 0;
            var contarFechaValida = 0;
            var contarFechaSiguiente = 0;
            var contarFechaRecuperarValida = 0;
            // VARIABLES DE ALMACENAMIENTO DE FILAS CON ERRORES
            var faltaFecha = '';
            var faltaDescripcion = '';
            var fechaInvalida = '';
            var recuperacionInvalida = '';
            var fechaDuplicada = '';
            var recuperacionDuplicada = '';
            var fechasIncorrectas = '';
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { fecha, descripcion, fec_recuperacion } = data;
                fila = fila + 1;
                // VERIFICACIÓN DE EXISTENCIA DE REGISTRO DE FECHA
                if (fecha != undefined) {
                    existeFecha = existeFecha + 1;
                    // VERIFICACIÓN DE EXSTENCIA DE REGISTRO DE DESCRIPCION
                    if (descripcion != undefined) {
                        existeDescripcion = existeDescripcion + 1;
                    }
                    else {
                        faltaDescripcion = faltaDescripcion + ' - Fila: ' + fila;
                    }
                    // VERIFICACIÓN DE FORMATO DE FECHA VÁLIDO
                    if (fecha === moment_1.default(fecha).format('YYYY-MM-DD')) {
                        contarFechaValida = contarFechaValida + 1;
                        // VERIFICACIÓN DE REGISTRO DE FECHA DENTRO DEL SISTEMA - NO SON VÁLIDAS FECHAS DUPLICADAS
                        const VERIFICAR_FECHA = yield database_1.default.query('SELECT * FROM cg_feriados WHERE fecha = $1 OR ' +
                            'fec_recuperacion = $1', [fecha]);
                        if (VERIFICAR_FECHA.rowCount === 0) {
                            contarFecha = contarFecha + 1;
                        }
                        else {
                            fechaDuplicada = fechaDuplicada + ' - Fila: ' + fila;
                        }
                        // CAMPO FEC_RECUPERACON QUE INDICA RECUPERACIÓN DE FERIADO NO ES OBLIGATORIO
                        if (fec_recuperacion != undefined) {
                            // VALIDACIÓN DE FORMATO DE FECHA DE RECUPERACIÓN
                            if (fec_recuperacion === moment_1.default(fec_recuperacion).format('YYYY-MM-DD')) {
                                contarFechaRecuperarValida = contarFechaRecuperarValida + 1;
                                // VALIDACIÓN DE INGRESO CORRECTO DE FECHAS - NO ES POSIBLE QUE FECHA DE RECUPERACIÓN SEA ANTERIOR A LA FECHA DE FERIADO
                                if (fec_recuperacion > fecha) {
                                    contarFechaSiguiente = contarFechaSiguiente + 1;
                                    // VERIFICACIÓN DE FECHA DE RECUPERACIÓN NO ESTE REGISTRADA EN EL SISTEMA
                                    const VERIFICAR_FECHA_RECUPERAR = yield database_1.default.query('SELECT * FROM cg_feriados ' +
                                        'WHERE fecha = $1 OR fec_recuperacion = $1', [fec_recuperacion]);
                                    if (VERIFICAR_FECHA_RECUPERAR.rowCount === 0) {
                                        contarRecuperacion = contarRecuperacion + 1;
                                    }
                                    else {
                                        recuperacionDuplicada = recuperacionDuplicada + ' - Fila: ' + fila;
                                    }
                                }
                                else {
                                    fechasIncorrectas = fechasIncorrectas + ' - Fila: ' + fila;
                                }
                            }
                            else {
                                recuperacionInvalida = recuperacionInvalida + ' - Fila: ' + fila;
                            }
                        }
                        else {
                            contarFechaRecuperarValida = contarFechaRecuperarValida + 1;
                            contarFechaSiguiente = contarFechaSiguiente + 1;
                            contarRecuperacion = contarRecuperacion + 1;
                        }
                    }
                    else {
                        fechaInvalida = fechaInvalida + ' - Fila: ' + fila;
                    }
                }
                else {
                    faltaFecha = faltaFecha + ' - Fila: ' + fila;
                }
                // ENVIO DE MENSAJES CUANDO SE HA LEIDO TODOS LOS DATOS DE LA PLANTILLA
                if (contador === plantilla.length) {
                    if (existeFecha === plantilla.length) {
                        if (existeDescripcion === plantilla.length) {
                            if (contarFechaValida === plantilla.length) {
                                if (contarFecha === plantilla.length) {
                                    if (contarFechaRecuperarValida === plantilla.length) {
                                        if (contarFechaSiguiente === plantilla.length) {
                                            if (contarRecuperacion === plantilla.length) {
                                                return res.jsonp({ message: 'CORRECTO' });
                                            }
                                            else {
                                                return res.jsonp({
                                                    message: 'FECHA DE RECUPERACION YA EXISTE',
                                                    data: recuperacionDuplicada
                                                });
                                            }
                                        }
                                        else {
                                            return res.jsonp({
                                                message: 'FECHA DE RECUPERACION ANTERIOR',
                                                data: fechasIncorrectas
                                            });
                                        }
                                    }
                                    else {
                                        return res.jsonp({
                                            message: 'FECHA DE RECUPERACION INVALIDA',
                                            data: recuperacionInvalida
                                        });
                                    }
                                }
                                else {
                                    return res.jsonp({ message: 'FECHA YA EXISTE', data: fechaDuplicada });
                                }
                            }
                            else {
                                return res.jsonp({ message: 'FECHA INVALIDA', data: fechaInvalida });
                            }
                        }
                        else {
                            return res.jsonp({
                                message: 'CAMPO DESCRIPCION ES OBLIGATORIO',
                                data: faltaDescripcion
                            });
                        }
                    }
                    else {
                        return res.jsonp({ message: 'CAMPO FECHA ES OBLIGATORIO', data: faltaFecha });
                    }
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    // REVISAR DATOS DUPLICADOS DENTRO DE LA MISMA PLANTILLA
    RevisarDatos_Duplicados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            // VARIABLES DE CONTADORES DE REGISTROS
            var contador = 1;
            var contarFecha = 0;
            var contarRecuperacion = 0;
            // ARRAY DE DATOS TOTALES DE PLANTILLA
            var datos_totales = [];
            // LECTURA DE DATOS DE LA PLANTILLA FILA POR FILA
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { fecha, fec_recuperacion } = data;
                let fila_datos = {
                    fecha: fecha,
                    fec_recuperacion: fec_recuperacion,
                };
                datos_totales.push(fila_datos);
            }));
            fs_1.default.unlinkSync(filePath);
            // VERIFICACIÓN DE FECHAS DUPLICADAS DENTRO DE LA MISMA PLANTILLA
            for (var i = 0; i <= datos_totales.length - 1; i++) {
                for (var j = 0; j <= datos_totales.length - 1; j++) {
                    // VERIFICAR SI LA FECHA SE ENCUENTRA DUPLICADA EN LA FILAS O SI ES IGUAL A UNA FECHA DE RECUPERACIÓN
                    if (datos_totales[i].fecha === datos_totales[j].fecha &&
                        datos_totales[i].fecha === datos_totales[j].fec_recuperacion) {
                        contarFecha = contarFecha + 1;
                    }
                    // VERIFICAR SI LA FECHA DE RECUPERACIÓN EXISTE
                    if (datos_totales[i].fec_recuperacion != undefined) {
                        // VERIFICAR SI LA FECHA DE RECUPERACIÓN SE ENCUNTRA DUPLICADA EN ALGUNA FILA O ES SIMILAR A LA FECHA DE FERIADO
                        if (datos_totales[i].fec_recuperacion === datos_totales[j].fec_recuperacion &&
                            datos_totales[i].fec_recuperacion === datos_totales[j].fecha) {
                            contarRecuperacion = contarRecuperacion + 1;
                        }
                    }
                }
                contador = contador + 1;
            }
            // ENVIO DE MENSAJES DE EVENTOS DESPUÉS DE LEER TODA LA PLANTILLA
            if ((contador - 1) === plantilla.length) {
                if (contarFecha === 0 && contarRecuperacion === 0) {
                    return res.jsonp({ message: 'CORRECTO' });
                }
                else {
                    return res.jsonp({ message: 'ERROR' });
                }
            }
        });
    }
    // MÉTODO PARA CREAR ARCHIVO EN FORMATO XML
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            let filename = "Feriados-" + req.body.userName + '-' + req.body.userId + '-' +
                new Date().getTime() + '.xml';
            fs_1.default.writeFile(`xmlDownload/${filename}`, xml, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
            res.jsonp({ text: 'XML creado', name: filename });
        });
    }
    // MÉTODO PARA DESCARGAR ARCHIVO XML DE FERIADOS
    downloadXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.params.nameXML;
            let filePath = `servidor\\xmlDownload\\${name}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    // MÉTODO PARA ELIMINAR UN REGISTRO DE FERIADOS
    EliminarFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM cg_feriados WHERE id = $1', [id]);
            res.jsonp({ text: 'registro eliminado' });
        });
    }
}
const FERIADOS_CONTROLADOR = new FeriadosControlador();
exports.default = FERIADOS_CONTROLADOR;
