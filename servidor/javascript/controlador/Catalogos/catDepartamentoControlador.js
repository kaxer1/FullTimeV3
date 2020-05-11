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
class DepartamentoControlador {
    ListarDepartamentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const DEPARTAMENTOS = yield database_1.default.query('SELECT * FROM VistaDepartamentoPadre ORDER BY nombre ASC');
            if (DEPARTAMENTOS.rowCount > 0) {
                return res.json(DEPARTAMENTOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarNombreDepartamentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const DEPARTAMENTOS = yield database_1.default.query('SELECT * FROM cg_departamentos');
            if (DEPARTAMENTOS.rowCount > 0) {
                return res.json(DEPARTAMENTOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarIdDepartamentoNombre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const DEPARTAMENTOS = yield database_1.default.query('SELECT * FROM cg_departamentos WHERE nombre = $1', [nombre]);
            if (DEPARTAMENTOS.rowCount > 0) {
                return res.json(DEPARTAMENTOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerIdDepartamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const DEPARTAMENTO = yield database_1.default.query('SELECT id FROM cg_departamentos WHERE nombre = $1', [nombre]);
            if (DEPARTAMENTO.rowCount > 0) {
                return res.json(DEPARTAMENTO.rows);
            }
            res.status(404).json({ text: 'El departamento no ha sido encontrado' });
        });
    }
    ObtenerUnDepartamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const DEPARTAMENTO = yield database_1.default.query('SELECT * FROM cg_departamentos WHERE id = $1', [id]);
            if (DEPARTAMENTO.rowCount > 0) {
                return res.json(DEPARTAMENTO.rows[0]);
            }
            res.status(404).json({ text: 'El departamento no ha sido encontrado' });
        });
    }
    ObtenerDepartamentosSucursal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_sucursal } = req.params;
            const DEPARTAMENTO = yield database_1.default.query('SELECT * FROM cg_departamentos WHERE id_sucursal = $1', [id_sucursal]);
            if (DEPARTAMENTO.rowCount > 0) {
                return res.json(DEPARTAMENTO.rows);
            }
            res.status(404).json({ text: 'El departamento no ha sido encontrado' });
        });
    }
    CrearDepartamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, depa_padre, nivel, id_sucursal } = req.body;
            yield database_1.default.query('INSERT INTO cg_departamentos (nombre, depa_padre, nivel, id_sucursal ) VALUES ($1, $2, $3, $4)', [nombre, depa_padre, nivel, id_sucursal]);
            res.json({ message: 'El departamento ha sido guardado con éxito' });
        });
    }
    ActualizarDepartamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, depa_padre, nivel, id_sucursal } = req.body;
            const { id } = req.params;
            yield database_1.default.query('UPDATE cg_departamentos set nombre = $1, depa_padre = $2, nivel = $3 , id_sucursal = $4 WHERE id = $5', [nombre, depa_padre, nivel, id_sucursal, id]);
            console.log(database_1.default.query);
            res.json({ message: 'El departamento ha sido modificado con éxito' });
        });
    }
}
exports.DEPARTAMENTO_CONTROLADOR = new DepartamentoControlador();
exports.default = exports.DEPARTAMENTO_CONTROLADOR;
