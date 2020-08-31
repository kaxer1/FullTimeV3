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
const fs_1 = __importDefault(require("fs"));
const ImagenCodificacion_1 = require("../../libs/ImagenCodificacion");
const builder = require('xmlbuilder');
const database_1 = __importDefault(require("../../database"));
class EmpresaControlador {
    ListarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const EMPRESA = yield database_1.default.query('SELECT * FROM cg_empresa ORDER BY nombre ASC');
            if (EMPRESA.rowCount > 0) {
                return res.jsonp(EMPRESA.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnaEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const EMPRESA = yield database_1.default.query('SELECT * FROM cg_empresa WHERE nombre = $1', [nombre]);
            if (EMPRESA.rowCount > 0) {
                return res.jsonp(EMPRESA.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante } = req.body;
            yield database_1.default.query('INSERT INTO cg_empresa (nombre, ruc, direccion, telefono, correo, tipo_empresa, representante  ) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante]);
            res.jsonp({ message: 'La Empresa se registró con éxito' });
        });
    }
    ActualizarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, id } = req.body;
            yield database_1.default.query('UPDATE cg_empresa SET nombre = $1, ruc = $2, direccion = $3, telefono = $4, correo = $5, tipo_empresa = $6, representante = $7 WHERE id = $8', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, id]);
            res.jsonp({ message: 'Empresa actualizada exitosamente' });
        });
    }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "Empresas-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM cg_empresa WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
    ListarEmpresaId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const EMPRESA = yield database_1.default.query('SELECT * FROM cg_empresa WHERE id = $1', [id]);
            if (EMPRESA.rowCount > 0) {
                return res.jsonp(EMPRESA.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    getImagenBase64(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file_name = yield database_1.default.query('select nombre, logo from cg_empresa where id = $1', [req.params.id_empresa])
                .then(result => {
                return result.rows[0];
            });
            const codificado = yield ImagenCodificacion_1.ImagenBase64LogosEmpresas(file_name.logo);
            if (codificado === 0) {
                res.send({ imagen: 0, nom_empresa: file_name.nombre });
            }
            else {
                res.send({ imagen: codificado, nom_empresa: file_name.nombre });
            }
        });
    }
    ActualizarLogoEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let logo = list.image[0].path.split("\\")[1];
            let id = req.params.id_empresa;
            console.log(logo, '====>', id);
            const logo_name = yield database_1.default.query('SELECT nombre, logo FROM cg_empresa WHERE id = $1', [id]);
            if (logo_name.rowCount > 0) {
                logo_name.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    if (obj.logo != null) {
                        try {
                            console.log(obj.logo);
                            let filePath = `servidor\\logos\\${obj.logo}`;
                            let direccionCompleta = __dirname.split("servidor")[0] + filePath;
                            fs_1.default.unlinkSync(direccionCompleta);
                            yield database_1.default.query('Update cg_empresa Set logo = $2 Where id = $1 ', [id, logo]);
                        }
                        catch (error) {
                            yield database_1.default.query('Update cg_empresa Set logo = $2 Where id = $1 ', [id, logo]);
                        }
                    }
                    else {
                        yield database_1.default.query('Update cg_empresa Set logo = $2 Where id = $1 ', [id, logo]);
                    }
                }));
            }
            const codificado = yield ImagenCodificacion_1.ImagenBase64LogosEmpresas(logo);
            res.send({ imagen: codificado, nom_empresa: logo_name.rows[0].nombre, message: 'Logo actualizado' });
        });
    }
}
exports.EMPRESA_CONTROLADOR = new EmpresaControlador();
exports.default = exports.EMPRESA_CONTROLADOR;
