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
const database_1 = __importDefault(require("../database"));
class DiscapacidadControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const discapacidad = yield database_1.default.query('SELECT * FROM cg_discapacidades');
            res.json(discapacidad.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const unaDiscapacidad = yield database_1.default.query('SELECT * FROM cg_discapacidades WHERE id_empleado = $1', [id_empleado]);
            if (unaDiscapacidad.rowCount > 0) {
                return res.json(unaDiscapacidad.rows);
            }
            res.status(404).json({ text: 'Discapacidad no encontrada' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, carn_conadis, porcentaje, tipo } = req.body;
            yield database_1.default.query('INSERT INTO cg_discapacidades ( id_empleado, carn_conadis, porcentaje, tipo) VALUES ($1, $2, $3, $4)', [id_empleado, carn_conadis, porcentaje, tipo]);
            console.log(req.body);
            res.json({ message: 'Discapacidad guardada' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { carn_conadis, porcentaje, tipo } = req.body;
            yield database_1.default.query('UPDATE cg_discapacidades SET carn_conadis = $1, porcentaje = $2, tipo = $3 WHERE id_empleado = $4', [carn_conadis, porcentaje, tipo, id_empleado]);
            res.json({ message: 'Discapacidad actualizada exitosamente' });
        });
    }
}
exports.discapacidadControlador = new DiscapacidadControlador();
exports.default = exports.discapacidadControlador;
