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
                return res.jsonp(CONTRATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const CONTRATOS = yield database_1.default.query('SELECT * FROM empl_contratos WHERE id = $1', [id]);
            if (CONTRATOS.rowCount > 0) {
                return res.jsonp(CONTRATOS.rows[0]);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre } = req.body;
            yield database_1.default.query('INSERT INTO empl_contratos (id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre]);
            const ultimo = yield database_1.default.query('SELECT MAX(id) AS id FROM empl_contratos');
            res.jsonp({ message: 'El contrato ha sido registrado', id: ultimo.rows[0].id });
        });
    }
    EncontrarIdContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CONTRATO = yield database_1.default.query('SELECT ec.id FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1 ORDER BY ec.fec_ingreso DESC ', [id_empleado]);
            if (CONTRATO.rowCount > 0) {
                return res.jsonp(CONTRATO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarIdContratoActual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CONTRATO = yield database_1.default.query('SELECT MAX(ec.id) FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
            if (CONTRATO.rowCount > 0) {
                if (CONTRATO.rows[0]['max'] != null) {
                    return res.jsonp(CONTRATO.rows);
                }
                else {
                    return res.status(404).jsonp({ text: 'Registro no encontrado' });
                }
            }
            else {
                return res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarDatosUltimoContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const CONTRATO = yield database_1.default.query('SELECT ec.id, ec.id_empleado, ec.id_regimen, ec.fec_ingreso, ec.fec_salida, ec.vaca_controla, ec.asis_controla, ec.doc_nombre, ec.documento, cr.descripcion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id = $1 AND ec.id_regimen = cr.id', [id]);
            if (CONTRATO.rowCount > 0) {
                return res.jsonp(CONTRATO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarContratoEmpleadoRegimen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const CONTRATO_EMPLEADO_REGIMEN = yield database_1.default.query('SELECT ec.id, ec.fec_ingreso, fec_salida, cr.descripcion, dia_anio_vacacion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id_empleado = $1 and ec.id_regimen = cr.id ORDER BY ec.id ASC', [id_empleado]);
            if (CONTRATO_EMPLEADO_REGIMEN.rowCount > 0) {
                return res.jsonp(CONTRATO_EMPLEADO_REGIMEN.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EditarContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, id } = req.params;
            const { fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre } = req.body;
            yield database_1.default.query('UPDATE empl_contratos SET fec_ingreso = $1, fec_salida = $2, vaca_controla = $3, asis_controla = $4, id_regimen = $5, doc_nombre = $6  WHERE id_empleado = $7 AND id = $8', [fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre, id_empleado, id]);
            res.jsonp({ message: 'Contrato del empleado actualizada exitosamente' });
        });
    }
    GuardarDocumentoContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let doc = list.uploads[0].path.split("\\")[1];
            let id = req.params.id;
            yield database_1.default.query('UPDATE empl_contratos SET documento = $2 WHERE id = $1', [id, doc]);
            res.jsonp({ message: 'Documento Actualizado' });
        });
    }
    ObtenerDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = req.params.docs;
            let filePath = `servidor\\contratos\\${docs}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    EditarDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { documento } = req.body;
            yield database_1.default.query('UPDATE empl_contratos SET documento = $1 WHERE id = $2', [documento, id]);
            res.jsonp({ message: 'Contrato Actualizado' });
        });
    }
    EncontrarFechaContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_cargo, id_empleado } = req.body;
            const FECHA = yield database_1.default.query('SELECT contrato.fec_ingreso FROM empl_contratos AS contrato, empl_cargos AS cargo, empleados WHERE contrato.id_empleado = empleados.id AND cargo.id_empl_contrato = contrato.id AND cargo.id = $1 AND empleados.id = $2', [id_cargo, id_empleado]);
            if (FECHA.rowCount > 0) {
                return res.jsonp(FECHA.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    EncontrarFechaContratoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_contrato } = req.body;
            const FECHA = yield database_1.default.query('SELECT contrato.fec_ingreso FROM empl_contratos AS contrato WHERE contrato.id = $1', [id_contrato]);
            if (FECHA.rowCount > 0) {
                return res.jsonp(FECHA.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
}
const CONTRATO_EMPLEADO_CONTROLADOR = new ContratoEmpleadoControlador();
exports.default = CONTRATO_EMPLEADO_CONTROLADOR;
