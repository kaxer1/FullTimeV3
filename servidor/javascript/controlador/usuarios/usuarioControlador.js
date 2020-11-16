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
exports.USUARIO_CONTROLADOR = void 0;
const database_1 = __importDefault(require("../../database"));
class UsuarioControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const USUARIOS = yield database_1.default.query('SELECT * FROM usuarios');
            if (USUARIOS.rowCount > 0) {
                return res.jsonp(USUARIOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    getIdByUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req.params;
            const unUsuario = yield database_1.default.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
            if (unUsuario.rowCount > 0) {
                return res.jsonp(unUsuario.rows);
            }
            else {
                res.status(404).jsonp({ text: 'No se ha encontrado el usuario' });
            }
        });
    }
    ObtenerDatosUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const UN_USUARIO = yield database_1.default.query('SELECT * FROM usuarios WHERE id_empleado = $1', [id_empleado]);
            if (UN_USUARIO.rowCount > 0) {
                return res.jsonp(UN_USUARIO.rows);
            }
            else {
                res.status(404).jsonp({ text: 'No se ha encontrado el usuario' });
            }
        });
    }
    ListarUsuriosNoEnrolados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const USUARIOS = yield database_1.default.query('SELECT u.id, u.usuario, ce.id_usuario FROM usuarios AS u LEFT JOIN cg_enrolados AS ce ON u.id = ce.id_usuario WHERE ce.id_usuario IS null');
            if (USUARIOS.rowCount > 0) {
                return res.jsonp(USUARIOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CambiarPasswordUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contrasena, id_empleado } = req.body;
            const UN_USUARIO = yield database_1.default.query('UPDATE usuarios SET contrasena = $1 WHERE id_empleado = $2', [contrasena, id_empleado]);
            res.jsonp({ message: 'Registro actualizado exitosamente' });
        });
    }
    // public async getIdByUsuario(req: Request, res: Response): Promise<any>{
    //   const  {id_empleado} = req.params;
    //   const unUsuario = await pool.query('SELECT * FROM usuarios WHERE id_empleado = $1', [id_empleado]);
    //   if (unUsuario.rowCount > 0) {
    //     return res.jsonp(unUsuario.rows);
    //   }
    //   res.status(404).jsonp({ text: 'No se ha encontrado el usuario' });
    // }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, contrasena, estado, id_rol, id_empleado, app_habilita } = req.body;
            yield database_1.default.query('INSERT INTO usuarios ( usuario, contrasena, estado, id_rol, id_empleado, app_habilita ) VALUES ($1, $2, $3, $4, $5, $6)', [usuario, contrasena, estado, id_rol, id_empleado, app_habilita]);
            res.jsonp({ message: 'Usuario Guardado' });
        });
    }
    ActualizarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, contrasena, id_rol, id_empleado } = req.body;
            yield database_1.default.query('UPDATE usuarios SET usuario = $1, contrasena = $2, id_rol = $3 WHERE id_empleado = $4', [usuario, contrasena, id_rol, id_empleado]);
            res.jsonp({ message: 'Usuario Actualizado' });
        });
    }
}
exports.USUARIO_CONTROLADOR = new UsuarioControlador();
exports.default = exports.USUARIO_CONTROLADOR;
