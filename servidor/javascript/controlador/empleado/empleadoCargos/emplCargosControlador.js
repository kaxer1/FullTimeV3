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
class EmpleadoCargosControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Cargos = yield database_1.default.query('SELECT * FROM empl_cargos');
            res.jsonp(Cargos.rows);
        });
    }
    ListarCargoEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleadoCargos = yield database_1.default.query('SELECT ecr.id AS cargo, e.id AS empleado, e.nombre, e.apellido FROM empl_cargos AS ecr, empl_contratos AS ecn, empleados AS e WHERE ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id ORDER BY cargo ASC');
            res.jsonp(empleadoCargos.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const unEmplCargp = yield database_1.default.query('SELECT ec.id, ec.id_empl_contrato, ec.id_departamento, ec.fec_inicio, ec.fec_final, ec.id_sucursal, ec.sueldo, ec.hora_trabaja, s.id_empresa FROM empl_cargos AS ec, sucursales AS s WHERE ec.id = $1 AND s.id = ec.id_sucursal', [id]);
            if (unEmplCargp.rowCount > 0) {
                return res.jsonp(unEmplCargp.rows);
            }
            res.status(404).jsonp({ text: 'Cargo del empleado no encontrado' });
        });
    }
    Crear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja } = req.body;
            yield database_1.default.query('INSERT INTO empl_cargos ( id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja]);
            console.log(req.body);
            res.jsonp({ message: 'Cargo empleado guardado' });
        });
    }
    EncontrarIdCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CARGO = yield database_1.default.query('SELECT ec.id FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id_empleado]);
            if (CARGO.rowCount > 0) {
                return res.jsonp(CARGO.rows);
            }
            else {
                res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarIdCargoActual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CARGO = yield database_1.default.query('SELECT MAX(e_cargo.id) FROM empl_cargos AS e_cargo, empl_contratos AS contrato_e, empleados AS e WHERE contrato_e.id_empleado = e.id AND e_cargo.id_empl_contrato = contrato_e.id AND e.id = $1', [id_empleado]);
            if (CARGO.rowCount > 0) {
                console.log("Patricia id cargo", CARGO.rows);
                if (CARGO.rows[0]['max'] != null) {
                    return res.jsonp(CARGO.rows);
                }
                else {
                    res.status(404).jsonp({ text: 'Registro no encontrado' });
                }
            }
            else {
                res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarInfoCargoEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_contrato } = req.params;
            const unEmplCargp = yield database_1.default.query('SELECT ec.id, ec.fec_inicio, ec.fec_final, ec.sueldo, ec.hora_trabaja, s.nombre AS sucursal, d.nombre AS departamento FROM empl_cargos AS ec, sucursales AS s, cg_departamentos AS d WHERE ec.id_empl_contrato = $1 AND ec.id_sucursal = s.id AND ec.id_departamento = d.id', [id_empl_contrato]);
            if (unEmplCargp.rowCount > 0) {
                return res.jsonp(unEmplCargp.rows);
            }
            res.status(404).jsonp({ text: 'Cargo del empleado no encontrado' });
        });
    }
    EditarCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_contrato, id } = req.params;
            const { id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja } = req.body;
            yield database_1.default.query('UPDATE empl_cargos SET id_departamento = $1, fec_inicio = $2, fec_final = $3, id_sucursal = $4, sueldo = $5, hora_trabaja = $6  WHERE id_empl_contrato = $7 AND id = $8', [id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja, id_empl_contrato, id]);
            res.jsonp({ message: 'Cargo del empleado actualizado exitosamente' });
        });
    }
}
exports.EMPLEADO_CARGO_CONTROLADOR = new EmpleadoCargosControlador();
exports.default = exports.EMPLEADO_CARGO_CONTROLADOR;
