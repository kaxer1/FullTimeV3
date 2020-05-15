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
const fs_1 = __importDefault(require("fs"));
const path = require("path");
class EmpleadoControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleado = yield database_1.default.query('SELECT * FROM empleados ORDER BY id');
            res.json(empleado.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const unEmpleado = yield database_1.default.query('SELECT * FROM empleados WHERE id = $1', [id]);
            if (unEmpleado.rowCount > 0) {
                return res.json(unEmpleado.rows);
            }
            res.status(404).json({ text: 'El empleado no ha sido encontrado' });
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
            res.json({ message: 'Empleado guardado', id: idEmployGuardado });
        });
    }
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad } = req.body;
            yield database_1.default.query('UPDATE empleados SET cedula = $2, apellido = $3, nombre = $4, esta_civil = $5, genero = $6, correo = $7, fec_nacimiento = $8, estado = $9, mail_alternativo = $10, domicilio = $11, telefono = $12, id_nacionalidad = $13 WHERE id = $1 ', [id, cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad]);
            res.json({ message: 'Empleado Actualizado' });
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
                            res.json({ message: 'Imagen Actualizada' });
                        }
                        catch (error) {
                            yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                            res.json({ message: 'Imagen Actualizada' });
                        }
                    }
                    else {
                        yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                        res.json({ message: 'Imagen Actualizada' });
                    }
                }));
            }
        });
    }
    createEmpleadoTitulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { observacion, id_empleado, id_titulo } = req.body;
            yield database_1.default.query('INSERT INTO empl_titulos ( observacion, id_empleado, id_titulo ) VALUES ($1, $2, $3)', [observacion, id_empleado, id_titulo]);
            res.json({ message: 'Titulo del empleado Guardado' });
        });
    }
    editarTituloDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_empleado_titulo;
            const { observacion, id_titulo } = req.body;
            yield database_1.default.query('UPDATE empl_titulos SET observacion = $1, id_titulo = $2 WHERE id = $3 ', [observacion, id_titulo, id]);
            res.json({ message: 'Titulo del empleado Actualizado' });
        });
    }
    eliminarTituloDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_empleado_titulo;
            yield database_1.default.query('DELETE FROM empl_titulos WHERE id = $1', [id]);
            res.json({ message: 'Registro eliminado' });
        });
    }
    getTitulosDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const unEmpleadoTitulo = yield database_1.default.query('SELECT et.id, et.observacion As observaciones, et.id_titulo, et.id_empleado, ct.nombre, nt.nombre as nivel FROM empl_titulos AS et, cg_titulos AS ct, nivel_titulo AS nt WHERE et.id_empleado = $1 and et.id_titulo = ct.id and ct.id_nivel = nt.id ORDER BY id', [id_empleado]);
            if (unEmpleadoTitulo.rowCount > 0) {
                return res.json(unEmpleadoTitulo.rows);
            }
            res.status(404).json({ text: 'El empleado no tiene titulos asignados' });
        });
    }
}
exports.EMPLEADO_CONTROLADOR = new EmpleadoControlador();
exports.default = exports.EMPLEADO_CONTROLADOR;
