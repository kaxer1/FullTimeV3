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
const fs_1 = __importDefault(require("fs"));
class BirthdayControlador {
    getImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagen = req.params.imagen;
            let filePath = `servidor\\cumpleanios\\${imagen}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    MensajeEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empresa } = req.params;
            const DAY = yield database_1.default.query('SELECT * FROM Message_birthday WHERE id_empresa = $1', [id_empresa]);
            if (DAY.rowCount > 0) {
                return res.jsonp(DAY.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearMensajeBirthday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empresa, titulo, link, mensaje } = req.body;
            yield database_1.default.query('INSERT INTO Message_birthday ( id_empresa, titulo, mensaje, url ) VALUES ($1, $2, $3, $4)', [id_empresa, titulo, mensaje, link]);
            const oneMessage = yield database_1.default.query('SELECT id FROM Message_birthday WHERE id_empresa = $1', [id_empresa]);
            const idMessageGuardado = oneMessage.rows[0].id;
            res.jsonp([{ message: 'Mensaje de cumpleaños empresarial guardado', id: idMessageGuardado }]);
        });
    }
    CrearImagenEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let imagen = list.uploads[0].path.split("\\")[1];
            let id = req.params.id_empresa;
            const unEmpleado = yield database_1.default.query('SELECT * FROM Message_birthday WHERE id = $1', [id]);
            if (unEmpleado.rowCount > 0) {
                unEmpleado.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    if (obj.img != null) {
                        try {
                            console.log(obj.img);
                            let filePath = `servidor\\cumpleanios\\${obj.img}`;
                            let direccionCompleta = __dirname.split("servidor")[0] + filePath;
                            fs_1.default.unlinkSync(direccionCompleta);
                            yield database_1.default.query('Update Message_birthday Set img = $2 Where id = $1 ', [id, imagen]);
                            res.jsonp({ message: 'Imagen Actualizada' });
                        }
                        catch (error) {
                            yield database_1.default.query('Update Message_birthday Set img = $2 Where id = $1 ', [id, imagen]);
                            res.jsonp({ message: 'Imagen Actualizada' });
                        }
                    }
                    else {
                        yield database_1.default.query('Update Message_birthday Set img = $2 Where id = $1 ', [id, imagen]);
                        res.jsonp({ message: 'Imagen Actualizada' });
                    }
                }));
            }
        });
    }
    EditarMensajeBirthday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { titulo, mensaje, link } = req.body;
            const { id_mensaje } = req.params;
            yield database_1.default.query('UPDATE Message_birthday SET titulo = $1, mensaje = $2, url = $3 WHERE id = $4', [titulo, mensaje, link, id_mensaje]);
            res.jsonp({ message: 'Mensaje de cumpleaños actualizado' });
        });
    }
}
exports.BIRTHDAY_CONTROLADOR = new BirthdayControlador();
exports.default = exports.BIRTHDAY_CONTROLADOR;
