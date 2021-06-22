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
const moment_1 = __importDefault(require("moment"));
const builder = require('xmlbuilder');
class FeriadosControlador {
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
    ActualizarFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha, descripcion, fec_recuperacion, id } = req.body;
                yield database_1.default.query('UPDATE cg_feriados SET fecha = $1, descripcion = $2, fec_recuperacion = $3 WHERE id = $4', [fecha, descripcion, fec_recuperacion, id]);
                res.jsonp({ message: 'Feriado actualizado exitosamente' });
            }
            catch (error) {
                return res.jsonp({ message: 'error' });
            }
        });
    }
    CrearFeriados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha, descripcion, fec_recuperacion } = req.body;
                yield database_1.default.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
                res.jsonp({ message: 'Feriado guardado' });
            }
            catch (error) {
                return res.jsonp({ message: 'error' });
            }
        });
    }
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
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { fecha, descripcion, fec_recuperacion } = data;
                if (fec_recuperacion === undefined) {
                    var recuperar = null;
                }
                else {
                    recuperar = fec_recuperacion;
                }
                yield database_1.default.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, recuperar]);
                if (contador === plantilla.length) {
                    console.log('ejecutandose');
                    return res.jsonp({ message: 'correcto' });
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    RevisarDatos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarFecha = 0;
            var contarFechaRecuperar = 0;
            var contarDescripcion = 0;
            var contador = 1;
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { fecha, descripcion, fec_recuperacion } = data;
                var fecha_data = fecha;
                var fec_recuperacion_data = fec_recuperacion;
                var descripcion_data = descripcion;
                // var fec = new Date(fecha_data);
                /*  console.log(' fec ',
                      fec
                  );*/
                console.log('ver fecha - feriados', moment_1.default(fecha_data).format('YYYY-MM-DD'));
                // console.log('ver fecha - feriados 1 ', fec.toString())
                if (fecha_data === moment_1.default(fecha_data).format('YYYY-MM-DD')) {
                    const VERIFICAR_FECHA = yield database_1.default.query('SELECT * FROM cg_feriados WHERE fecha = $1 OR fec_recuperacion = $1', [fecha_data]);
                    if (VERIFICAR_FECHA.rowCount === 0) {
                        contarFecha = contarFecha + 1;
                    }
                    if (fec_recuperacion != undefined) {
                        console.log('ver fecha - feriados', moment_1.default(fec_recuperacion_data).format('YYYY-MM-DD'));
                        if (fec_recuperacion_data === moment_1.default(fec_recuperacion_data).format('YYYY-MM-DD')) {
                            const VERIFICAR_FECHA_RECUPERAR = yield database_1.default.query('SELECT * FROM cg_feriados WHERE fecha = $1 OR fec_recuperacion = $1', [fec_recuperacion_data]);
                            if (VERIFICAR_FECHA_RECUPERAR.rowCount === 0 && fec_recuperacion > fecha) {
                                contarFechaRecuperar = contarFechaRecuperar + 1;
                            }
                        }
                    }
                    else {
                        contarFechaRecuperar = contarFechaRecuperar + 1;
                    }
                    if (descripcion_data != undefined) {
                        contarDescripcion = contarDescripcion + 1;
                    }
                }
                // Verificación cuando se ha leido todos los datos de la plantilla
                console.log('fecha', contarFecha, plantilla.length, contador);
                console.log('fecha_rec', contarFechaRecuperar, plantilla.length, contador);
                console.log('descripcion', contarDescripcion, plantilla.length, contador);
                if (contador === plantilla.length) {
                    if (contarFecha === plantilla.length && contarFechaRecuperar === plantilla.length &&
                        contarDescripcion === plantilla.length) {
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
    RevisarDatos_Duplicados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contador = 1;
            var contarFechaData = 0;
            var contarFechaRecuperarData = 0;
            var array_todo = [];
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { fecha, descripcion, fec_recuperacion } = data;
                let datos_array = {
                    fecha: fecha,
                    fec_recuperacion: fec_recuperacion,
                    descripcion: descripcion
                };
                array_todo.push(datos_array);
            }));
            fs_1.default.unlinkSync(filePath);
            console.log('array', array_todo);
            console.log('array2', array_todo[0].fecha);
            for (var i = 0; i <= array_todo.length - 1; i++) {
                for (var j = 0; j <= array_todo.length - 1; j++) {
                    console.log('fecha....', array_todo[i].fecha, array_todo[j].fecha, array_todo[j].fec_recuperacion, array_todo[j].fec_recuperacion, plantilla.length, contador);
                    if (array_todo[i].fecha === array_todo[j].fecha && array_todo[i].fecha === array_todo[j].fec_recuperacion) {
                        contarFechaData = contarFechaData + 1;
                    }
                    if (array_todo[i].fec_recuperacion != undefined) {
                        if (array_todo[i].fec_recuperacion === array_todo[j].fec_recuperacion &&
                            array_todo[i].fec_recuperacion === array_todo[j].fecha) {
                            contarFechaRecuperarData = contarFechaRecuperarData + 1;
                        }
                    }
                }
                contador = contador + 1;
            }
            console.log('fecha1', contarFechaData, plantilla.length, contador);
            console.log('fecha_rec1', contarFechaRecuperarData, plantilla.length, contador);
            if ((contador - 1) === plantilla.length) {
                if (contarFechaData === 0 &&
                    contarFechaRecuperarData === 0) {
                    return res.jsonp({ message: 'correcto' });
                }
                else {
                    return res.jsonp({ message: 'error' });
                }
            }
        });
    }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "Feriados-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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
