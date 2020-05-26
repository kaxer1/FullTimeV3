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
class AutorizaDepartamentoControlador {
    ListarAutorizaDepartamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const AUTORIZA = yield database_1.default.query('SELECT * FROM depa_autorizaciones');
            if (AUTORIZA.rowCount > 0) {
                return res.json(AUTORIZA.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearAutorizaDepartamento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_departamento, id_empl_cargo, estado } = req.body;
            yield database_1.default.query('INSERT INTO depa_autorizaciones (id_departamento, id_empl_cargo, estado) VALUES ($1, $2, $3)', [id_departamento, id_empl_cargo, estado]);
            res.json({ message: 'Autorización se registró con éxito' });
        });
    }
    EncontrarAutorizacionCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo } = req.params;
            const AUTORIZA = yield database_1.default.query('SELECT *FROM VistaDepartamentoAutoriza WHERE id_empl_cargo= $1', [id_empl_cargo]);
            if (AUTORIZA.rowCount > 0) {
                return res.json(AUTORIZA.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
}
exports.AUTORIZA_DEPARTAMENTO_CONTROLADOR = new AutorizaDepartamentoControlador();
exports.default = exports.AUTORIZA_DEPARTAMENTO_CONTROLADOR;
