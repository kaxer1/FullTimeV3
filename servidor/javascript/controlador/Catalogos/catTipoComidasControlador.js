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
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const builder = require('xmlbuilder');
const database_1 = __importDefault(require("../../database"));
class TipoComidasControlador {
    ListarTipoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const TIPO_COMIDAS = yield database_1.default.query('SELECT * FROM cg_tipo_comidas ORDER BY nombre, observacion ASC');
            if (TIPO_COMIDAS.rowCount > 0) {
                return res.jsonp(TIPO_COMIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnTipoComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const TIPO_COMIDAS = yield database_1.default.query('SELECT * FROM cg_tipo_comidas WHERE id = $1', [id]);
            if (TIPO_COMIDAS.rowCount > 0) {
                return res.jsonp(TIPO_COMIDAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearTipoComidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, valor, observacion } = req.body;
            yield database_1.default.query('INSERT INTO cg_tipo_comidas (nombre, valor, observacion) VALUES ($1, $2, $3)', [nombre, valor, observacion]);
            res.jsonp({ message: 'Tipo de comida registrada' });
        });
    }
    ActualizarComida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, valor, observacion, id } = req.body;
            yield database_1.default.query('UPDATE cg_tipo_comidas SET nombre = $1, valor = $2, observacion = $3 WHERE id = $4', [nombre, valor, observacion, id]);
            res.jsonp({ message: 'Feriado actualizado exitosamente' });
        });
    }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "Comidas-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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
    CrearTipoComidasPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { nombre, valor, observacion } = data;
                if (nombre != undefined) {
                    yield database_1.default.query('INSERT INTO cg_tipo_comidas (nombre, valor, observacion) VALUES ($1, $2, $3)', [nombre, valor, observacion]);
                }
                else {
                    res.jsonp({ error: 'plantilla equivocada' });
                }
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
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
            var contarDatos = 0;
            var contarLlenos = 0;
            var contador = 1;
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { nombre, valor, observacion } = data;
                if (nombre != undefined && valor != undefined && observacion != undefined) {
                    contarLlenos = contarLlenos + 1;
                }
                if (observacion != undefined) {
                    var datos_observacion = observacion.toUpperCase();
                }
                else {
                    datos_observacion = observacion;
                }
                const VERIFICAR_DATOS = yield database_1.default.query('SELECT * FROM cg_tipo_comidas WHERE UPPER(nombre) = $1 AND ' +
                    'valor = $2 AND UPPER(observacion) = $3', [nombre.toUpperCase(), valor, datos_observacion]);
                if (VERIFICAR_DATOS.rowCount === 0) {
                    contarDatos = contarDatos + 1;
                }
                // Verificación cuando se ha leido todos los datos de la plantilla
                console.log('datos', contarDatos, plantilla.length, contador);
                console.log('llenos', contarLlenos, plantilla.length, contador);
                if (contador === plantilla.length) {
                    if (contarDatos === plantilla.length && contarLlenos === plantilla.length) {
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
            var contarDatosData = 0;
            var array_datos = [];
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { nombre, valor, observacion } = data;
                let datos_array = {
                    nombre: nombre,
                    valor: valor,
                    observacion: observacion
                };
                array_datos.push(datos_array);
            }));
            console.log('array', array_datos);
            for (var i = 0; i <= array_datos.length - 1; i++) {
                for (var j = 0; j <= array_datos.length - 1; j++) {
                    if (array_datos[i].nombre.toUpperCase() === array_datos[j].nombre.toUpperCase() &&
                        array_datos[i].valor === array_datos[j].valor
                        && array_datos[i].observacion.toUpperCase() === array_datos[j].observacion.toUpperCase()) {
                        contarDatosData = contarDatosData + 1;
                    }
                }
                contador = contador + 1;
            }
            console.log('datos', contarDatosData, plantilla.length, contador);
            if ((contador - 1) === plantilla.length) {
                if (contarDatosData === plantilla.length) {
                    return res.jsonp({ message: 'correcto' });
                }
                else {
                    return res.jsonp({ message: 'error' });
                }
            }
            fs_1.default.unlinkSync(filePath);
        });
    }
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM cg_tipo_comidas WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
}
const TIPO_COMIDAS_CONTROLADOR = new TipoComidasControlador();
exports.default = TIPO_COMIDAS_CONTROLADOR;
