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
            const { id, id_empl_cargo, fec_inicio, fec_final } = req.body;
            yield database_1.default.query('INSERT INTO empl_procesos (id, id_empl_cargo, fec_inicio, fec_final) VALUES ($1, $2, $3, $4)', [id, id_empl_cargo, fec_inicio, fec_final]);
            res.json({ message: 'Procesos del empleado guardados con éxito' });
        });
    }
    EncontrarProcesoPorIdCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo } = req.params;
            const HORARIO_CARGO = yield database_1.default.query('SELECT ep.id_p, ep.id, ep.id_empl_cargo, ep.fec_inicio, ep.fec_final, cp.nombre AS proceso FROM empl_procesos AS ep, cg_procesos AS cp WHERE ep.id_empl_cargo = $1 AND ep.id = cp.id', [id_empl_cargo]);
            if (HORARIO_CARGO.rowCount > 0) {
                return res.json(HORARIO_CARGO.rows);
            }
            res.status(404).json({ text: 'Registro no encontrado' });
        });
    }
    ActualizarProcesoEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, id_empl_cargo, fec_inicio, fec_final, id_p } = req.body;
            yield database_1.default.query('UPDATE empl_procesos SET id = $1, id_empl_cargo = $2, fec_inicio = $3, fec_final = $4 WHERE id_p = $5', [id, id_empl_cargo, fec_inicio, fec_final, id_p]);
            res.json({ message: 'Proceso actualizado exitosamente' });
        });
    }
}
exports.EMPLEADO_PROCESO_CONTROLADOR = new EmpleadoProcesoControlador();
exports.default = exports.EMPLEADO_PROCESO_CONTROLADOR;
