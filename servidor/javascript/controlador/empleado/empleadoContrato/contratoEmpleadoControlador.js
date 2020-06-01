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
class ContratoEmpleadoControlador {
    ListarContratos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const CONTRATOS = yield database_1.default.query('SELECT * FROM empl_contratos');
            if (CONTRATOS.rowCount > 0) {
                return res.json(CONTRATOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const CONTRATOS = yield database_1.default.query('SELECT * FROM empl_contratos WHERE id = $1', [id]);
            if (CONTRATOS.rowCount > 0) {
                return res.json(CONTRATOS.rows[0]);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen } = req.body;
            yield database_1.default.query('INSERT INTO empl_contratos (id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen) VALUES ($1, $2, $3, $4, $5, $6)', [id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen]);
            res.json({ message: 'Contrato guardado' });
        });
    }
    EncontrarIdContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CONTRATO = yield database_1.default.query('SELECT ec.id FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
            if (CONTRATO.rowCount > 0) {
                return res.json(CONTRATO.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
    EncontrarIdContratoActual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CONTRATO = yield database_1.default.query('SELECT MAX(ec.id) FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
            if (CONTRATO.rowCount > 0) {
                if (CONTRATO.rows[0]['max'] != null) {
                    return res.json(CONTRATO.rows);
                }
                else {
                    res.status(404).json({ text: 'Registro no encontrado' });
                }
            }
            else {
                res.status(404).json({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarContratoIdEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CONTRATO = yield database_1.default.query('SELECT ec.id, ec.id_empleado, ec.id_regimen, ec.fec_ingreso, ec.fec_salida, ec.vaca_controla, ec.asis_controla, cr.descripcion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id_empleado = $1 AND ec.id_regimen = cr.id', [id_empleado]);
            if (CONTRATO.rowCount > 0) {
                return res.json(CONTRATO.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
    EncontrarContratoEmpleadoRegimen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CONTRATO_EMPLEADO_REGIMEN = yield database_1.default.query('SELECT ec.fec_ingreso, fec_salida, cr.descripcion, dia_anio_vacacion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id_empleado = $1 and ec.id_regimen = cr.id', [id_empleado]);
            if (CONTRATO_EMPLEADO_REGIMEN.rowCount > 0) {
                return res.json(CONTRATO_EMPLEADO_REGIMEN.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
    EditarContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, id } = req.params;
            const { fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen } = req.body;
            yield database_1.default.query('UPDATE empl_contratos SET fec_ingreso = $1, fec_salida = $2, vaca_controla = $3, asis_controla = $4, id_regimen = $5  WHERE id_empleado = $6 AND id = $7', [fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, id_empleado, id]);
            res.json({ message: 'Contrato del empleado actualizada exitosamente' });
        });
    }
}
const CONTRATO_EMPLEADO_CONTROLADOR = new ContratoEmpleadoControlador();
exports.default = CONTRATO_EMPLEADO_CONTROLADOR;
