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
class EmpleadoProcesoControlador {
    ListarEmpleProcesos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PROCESOS = yield database_1.default.query('SELECT *FROM empl_procesos');
            if (PROCESOS.rowCount > 0) {
                return res.json(PROCESOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearEmpleProcesos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo, fec_inicio, fec_final } = req.body;
            yield database_1.default.query('INSERT INTO empl_procesos (id_empl_cargo, fec_inicio, fec_final) VALUES ($1, $2, $3)', [id_empl_cargo, fec_inicio, fec_final]);
            res.json({ message: 'Procesos del empleado guardados con éxito' });
        });
    }
}
exports.EMPLEADO_PROCESO_CONTROLADOR = new EmpleadoProcesoControlador();
exports.default = exports.EMPLEADO_PROCESO_CONTROLADOR;
