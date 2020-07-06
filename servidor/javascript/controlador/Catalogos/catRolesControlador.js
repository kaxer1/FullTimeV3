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
const builder = require('xmlbuilder');
const fs_1 = __importDefault(require("fs"));
const database_1 = __importDefault(require("../../database"));
class RolesControlador {
    ListarRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ROL = yield database_1.default.query('SELECT * FROM cg_roles ORDER BY nombre ASC');
            if (ROL.rowCount > 0) {
                return res.jsonp(ROL.rows);
            }
            else {
                res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    ObtnenerUnRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const ROL = yield database_1.default.query('SELECT * FROM cg_roles WHERE id = $1', [id]);
            if (ROL.rowCount > 0) {
                return res.jsonp(ROL.rows);
            }
            else {
                res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        });
    }
    CrearRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.body;
            yield database_1.default.query('INSERT INTO cg_roles (nombre) VALUES ($1)', [nombre]);
            res.jsonp({ message: 'Rol guardado' });
        });
    }
    ActualizarRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, id } = req.body;
            yield database_1.default.query('UPDATE cg_roles SET nombre = $1 WHERE id = $2', [nombre, id]);
            res.jsonp({ message: 'Registro Actualizado' });
        });
    }
    // public async update(req: Request, res: Response): Promise<void> {
    //   const { id } = req.params;
    //   const { descripcion, usuarios } = req.body;
    //   await pool.query('UPDATE cg_roles SET descripcion = $1, usuarios = $2 WHERE id = $3', [descripcion, usuarios, id]);
    //   //res.jsonp({text: 'eliminado un dato ' + req.params.id});
    //   res.jsonp({ message: 'Rol actualizado exitosamente' });
    //   // res.jsonp({text: 'Actualizando un dato ' + req.params.id});
    // }
    // public async delete(req: Request, res: Response): Promise<void> {
    //   const { id } = req.params;
    //   await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    //   //res.jsonp({text: 'eliminado un dato ' + req.params.id});
    //   res.jsonp({ message: 'Rol eliminado' });
    // }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "Roles-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
            fs_1.default.writeFile(`xmlDownload/${filename}`, xml, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Archivo guardado");
            });
            res.jsonp({ text: 'XML creado', name: filename });
        });
    }
    downloadXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.params.nameXML;
            let filePath = `servidor\\xmlDownload\\${name}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
}
const ROLES_CONTROLADOR = new RolesControlador();
exports.default = ROLES_CONTROLADOR;
