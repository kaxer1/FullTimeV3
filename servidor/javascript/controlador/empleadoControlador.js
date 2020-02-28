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
class EmpleadoControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleado = yield database_1.default.query('SELECT * FROM empleado');
            //res.json({text: 'Describe prueba'});
            res.json(empleado.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM empleado WHERE id = $1', [id]);
            // console.log(rol);
            if (rol.rowCount > 0) {
                return res.json(rol.rows[0]);
            }
            //res.json({message: 'Rol encontrado'});
            //res.json({text: 'Esta es una prueba ' + req.params.id});
            res.status(404).json({ text: 'El rol no ha sido encontrado' });
        });
    }
}
exports.empleadoControlador = new EmpleadoControlador();
exports.default = exports.empleadoControlador;
