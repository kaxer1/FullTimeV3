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
const path = require("path");
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const ts_md5_1 = require("ts-md5");
const builder = require('xmlbuilder');
class EmpleadoControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleado = yield database_1.default.query('SELECT * FROM empleados ORDER BY id');
            res.jsonp(empleado.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const unEmpleado = yield database_1.default.query('SELECT * FROM empleados WHERE id = $1', [id]);
            if (unEmpleado.rowCount > 0) {
                return res.jsonp(unEmpleado.rows);
            }
            res.status(404).jsonp({ text: 'El empleado no ha sido encontrado' });
        });
    }
    getImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagen = req.params.imagen;
            let filePath = `servidor\\imagenesEmpleados\\${imagen}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad } = req.body;
            yield database_1.default.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad]);
            const oneEmpley = yield database_1.default.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
            const idEmployGuardado = oneEmpley.rows[0].id;
            res.jsonp({ message: 'Empleado guardado', id: idEmployGuardado });
        });
    }
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad } = req.body;
            yield database_1.default.query('UPDATE empleados SET cedula = $2, apellido = $3, nombre = $4, esta_civil = $5, genero = $6, correo = $7, fec_nacimiento = $8, estado = $9, mail_alternativo = $10, domicilio = $11, telefono = $12, id_nacionalidad = $13 WHERE id = $1 ', [id, cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad]);
            res.jsonp({ message: 'Empleado Actualizado' });
        });
    }
    crearImagenEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let imagen = list.image[0].path.split("\\")[1];
            let id = req.params.id_empleado;
            const unEmpleado = yield database_1.default.query('SELECT * FROM empleados WHERE id = $1', [id]);
            if (unEmpleado.rowCount > 0) {
                unEmpleado.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    if (obj.imagen != null) {
                        try {
                            console.log(obj.imagen);
                            let filePath = `servidor\\imagenesEmpleados\\${obj.imagen}`;
                            let direccionCompleta = __dirname.split("servidor")[0] + filePath;
                            fs_1.default.unlinkSync(direccionCompleta);
                            yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                            res.jsonp({ message: 'Imagen Actualizada' });
                        }
                        catch (error) {
                            yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                            res.jsonp({ message: 'Imagen Actualizada' });
                        }
                    }
                    else {
                        yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                        res.jsonp({ message: 'Imagen Actualizada' });
                    }
                }));
            }
        });
    }
    CargaPlantillaEmpleadoUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // realiza un capital letter a los nombres y apellidos
                let nombres = data.nombre.split(' ');
                let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
                let name2 = nombres[1].charAt(0).toUpperCase() + nombres[1].slice(1);
                const nombre = name1 + ' ' + name2;
                let apellidos = data.apellido.split(' ');
                let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
                let lastname2 = apellidos[1].charAt(0).toUpperCase() + apellidos[1].slice(1);
                const apellido = lastname1 + ' ' + lastname2;
                // encriptar contraseña
                const md5 = new ts_md5_1.Md5();
                const contrasena = md5.appendStr(data.contrasena).end();
                const { cedula, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, usuario, estado_user, id_rol, app_habilita } = data;
                if (cedula != undefined) {
                    yield database_1.default.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad]);
                    const oneEmpley = yield database_1.default.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
                    const id_empleado = oneEmpley.rows[0].id;
                    yield database_1.default.query('INSERT INTO usuarios ( usuario, contrasena, estado, id_rol, id_empleado, app_habilita ) VALUES ($1, $2, $3, $4, $5, $6)', [usuario, contrasena, estado, id_rol, id_empleado, app_habilita]);
                }
                else {
                    res.jsonp({ error: 'plantilla equivocada' });
                }
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
    createEmpleadoTitulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { observacion, id_empleado, id_titulo } = req.body;
            yield database_1.default.query('INSERT INTO empl_titulos ( observacion, id_empleado, id_titulo ) VALUES ($1, $2, $3)', [observacion, id_empleado, id_titulo]);
            res.jsonp({ message: 'Titulo del empleado Guardado' });
        });
    }
    editarTituloDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_empleado_titulo;
            const { observacion, id_titulo } = req.body;
            yield database_1.default.query('UPDATE empl_titulos SET observacion = $1, id_titulo = $2 WHERE id = $3 ', [observacion, id_titulo, id]);
            res.jsonp({ message: 'Titulo del empleado Actualizado' });
        });
    }
    eliminarTituloDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_empleado_titulo;
            yield database_1.default.query('DELETE FROM empl_titulos WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
    getTitulosDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const unEmpleadoTitulo = yield database_1.default.query('SELECT et.id, et.observacion As observaciones, et.id_titulo, et.id_empleado, ct.nombre, nt.nombre as nivel FROM empl_titulos AS et, cg_titulos AS ct, nivel_titulo AS nt WHERE et.id_empleado = $1 and et.id_titulo = ct.id and ct.id_nivel = nt.id ORDER BY id', [id_empleado]);
            if (unEmpleadoTitulo.rowCount > 0) {
                return res.jsonp(unEmpleadoTitulo.rows);
            }
            res.status(404).jsonp({ text: 'El empleado no tiene titulos asignados' });
        });
    }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "Empleado-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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
    ObtenerDepartamentoEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_emple, id_cargo } = req.body;
            const DEPARTAMENTO = yield database_1.default.query('SELECT *FROM VistaDepartamentoEmpleado WHERE id_emple = $1 AND id_cargo = $2', [id_emple, id_cargo]);
            if (DEPARTAMENTO.rowCount > 0) {
                return res.jsonp(DEPARTAMENTO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
}
exports.EMPLEADO_CONTROLADOR = new EmpleadoControlador();
exports.default = exports.EMPLEADO_CONTROLADOR;
