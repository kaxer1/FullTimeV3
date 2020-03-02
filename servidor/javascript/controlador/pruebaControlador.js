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
class PruebaControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield database_1.default.query('SELECT * FROM roles');
            //res.json({text: 'Describe prueba'});
            res.json(roles.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM roles WHERE id = $1', [id]);
            // console.log(rol);
            if (rol.rowCount > 0) {
                return res.json(rol.rows[0]);
            }
            //res.json({message: 'Rol encontrado'});
            //res.json({text: 'Esta es una prueba ' + req.params.id});
            res.status(404).json({ text: 'El rol no ha sido encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descripcion } = req.body;
            yield database_1.default.query('INSERT INTO roles (descripcion) VALUES ($1)', [descripcion]);
            //console.log(req.body);
            res.json({ message: 'Rol guardado' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { descripcion, usuarios } = req.body;
            yield database_1.default.query('UPDATE roles SET descripcion = $1, usuarios = $2 WHERE id = $3', [descripcion, usuarios, id]);
            //res.json({text: 'eliminado un dato ' + req.params.id});
            res.json({ message: 'Rol actualizado exitosamente' });
            // res.json({text: 'Actualizando un dato ' + req.params.id});
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM roles WHERE id = $1', [id]);
            //res.json({text: 'eliminado un dato ' + req.params.id});
            res.json({ message: 'Rol eliminado' });
        });
    }
}
const pruebaControlador = new PruebaControlador();
exports.default = pruebaControlador;
