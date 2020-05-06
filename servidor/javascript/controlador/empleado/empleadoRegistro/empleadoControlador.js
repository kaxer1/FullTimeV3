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
class EmpleadoControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body.userId + ' este es del listar empleado');
            const empleado = yield database_1.default.query('SELECT * FROM empleados');
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
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad } = req.body;
            yield database_1.default.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad]);
            console.log(req.body);
            const oneEmpley = yield database_1.default.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
            const idEmployGuardado = oneEmpley.rows[0].id;
            res.json({ message: 'Empleado guardado', id: idEmployGuardado });
        });
    }
    createEmpleadoTitulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { observacion, id_empleado, id_titulo } = req.body;
            yield database_1.default.query('INSERT INTO empl_titulos ( observacion, id_empleado, id_titulo ) VALUES ($1, $2, $3)', [observacion, id_empleado, id_titulo]);
            console.log(req.body);
            res.json({ message: 'Titulo del empleado Guardado' });
        });
    }
    getTitulosDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const unEmpleadoTitulo = yield database_1.default.query('SELECT et.observacion As observaciones, ct.nombre, nt.nombre as nivel FROM empl_titulos AS et, cg_titulos AS ct, nivel_titulo AS nt WHERE et.id_empleado = $1 and et.id_titulo = ct.id and ct.id_nivel = nt.id', [id_empleado]);
            if (unEmpleadoTitulo.rowCount > 0) {
                return res.json(unEmpleadoTitulo.rows);
            }
            res.status(404).json({ text: 'El empleado no tiene titulos asignados' });
        });
    }
}
exports.EMPLEADO_CONTROLADOR = new EmpleadoControlador();
exports.default = exports.EMPLEADO_CONTROLADOR;
