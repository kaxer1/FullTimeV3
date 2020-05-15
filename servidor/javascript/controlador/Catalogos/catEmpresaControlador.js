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
class EmpresaControlador {
    ListarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const EMPRESA = yield database_1.default.query('SELECT * FROM cg_empresa ORDER BY nombre ASC');
            if (EMPRESA.rowCount > 0) {
                return res.json(EMPRESA.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante } = req.body;
            yield database_1.default.query('INSERT INTO cg_empresa (nombre, ruc, direccion, telefono, correo, tipo_empresa, representante  ) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante]);
            res.json({ message: 'La Empresa se registró con éxito' });
        });
    }
    ActualizarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, id } = req.body;
            yield database_1.default.query('UPDATE cg_empresa SET nombre = $1, ruc = $2, direccion = $3, telefono = $4, correo = $5 tipo_empresa = $6, representante = $7 WHERE id = $8', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, id]);
            res.json({ message: 'Empresa actualizada exitosamente' });
        });
    }
}
exports.EMPRESA_CONTROLADOR = new EmpresaControlador();
exports.default = exports.EMPRESA_CONTROLADOR;
