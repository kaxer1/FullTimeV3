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
class UsuarioControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const titulo = yield database_1.default.query('SELECT * FROM usuarios');
            res.json(titulo.rows);
        });
    }
    getIdByUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req.params;
            const unUsuario = yield database_1.default.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
            if (unUsuario.rowCount > 0) {
                return res.json(unUsuario.rows);
            }
            res.status(404).json({ text: 'No se ha encontrado el usuario' });
        });
    }
}
exports.USUARIO_CONTROLADOR = new UsuarioControlador();
exports.default = exports.USUARIO_CONTROLADOR;
