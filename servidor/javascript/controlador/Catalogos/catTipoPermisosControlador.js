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
const builder = require('xmlbuilder');
const database_1 = __importDefault(require("../../database"));
class TipoPermisosControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rolPermisos = yield database_1.default.query('SELECT * FROM cg_tipo_permisos ORDER BY descripcion');
            res.jsonp(rolPermisos.rows);
        });
    }
    listAccess(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const acce_empleado = req.params.acce_empleado;
            const rolPermisos = yield database_1.default.query('SELECT * FROM cg_tipo_permisos WHERE acce_empleado = $1 ORDER BY descripcion', [acce_empleado]);
            res.json(rolPermisos.rows);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const unTipoPermiso = yield database_1.default.query('SELECT * FROM cg_tipo_permisos WHERE id = $1', [id]);
            if (unTipoPermiso.rowCount > 0) {
                return res.jsonp(unTipoPermiso.rows);
            }
            res.status(404).jsonp({ text: 'Rol permiso no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo } = req.body;
            yield database_1.default.query('INSERT INTO cg_tipo_permisos (descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo]);
            res.jsonp({ message: 'Guardado Tipo Permiso' });
        });
    }
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo } = req.body;
            yield database_1.default.query('UPDATE cg_tipo_permisos SET descripcion = $1, tipo_descuento = $2, num_dia_maximo = $3, num_dia_ingreso = $4, vaca_afecta = $5, anio_acumula = $6, correo = $7, gene_justificacion = $8, fec_validar = $9, acce_empleado = $10, actualizar = $11, autorizar = $12, eliminar = $13, legalizar = $14, preautorizar = $15, almu_incluir = $16, num_dia_justifica = $17, num_hora_maximo = $18 WHERE id = $19', [descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo, id]);
            res.jsonp({ message: 'Tipo Permiso Actualizado' });
        });
    }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "TipoPermisos-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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
exports.TIPO_PERMISOS_CONTROLADOR = new TipoPermisosControlador();
exports.default = exports.TIPO_PERMISOS_CONTROLADOR;
