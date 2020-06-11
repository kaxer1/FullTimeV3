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
class PermisosControlador {
    ListarPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PERMISOS = yield database_1.default.query('SELECT * FROM permisos');
            if (PERMISOS.rowCount > 0) {
                return res.jsonp(PERMISOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarEstadosPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const PERMISOS = yield database_1.default.query('SELECT p.id, p.fec_creacion, p.descripcion, p.fec_inicio, p.documento, p.docu_nombre, p.fec_final, p.estado, e.nombre, e.apellido, e.cedula, cp.descripcion AS nom_permiso FROM permisos AS p, empl_contratos AS ec, empleados AS e, cg_tipo_permisos AS cp WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND p.id_tipo_permiso = cp.id ORDER BY fec_creacion DESC');
            if (PERMISOS.rowCount > 0) {
                return res.json(PERMISOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const PERMISOS = yield database_1.default.query('SELECT * FROM permisos WHERE id = $1', [id]);
            if (PERMISOS.rowCount > 0) {
                return res.json(PERMISOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso, docu_nombre } = req.body;
            yield database_1.default.query('INSERT INTO permisos (fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso, docu_nombre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso, docu_nombre]);
            const ultimo = yield database_1.default.query('SELECT id FROM permisos WHERE fec_creacion = $1 AND  id_tipo_permiso = $2 AND id_empl_contrato = $3', [fec_creacion, id_tipo_permiso, id_empl_contrato]);
            console.log(ultimo.rows[0].id);
            res.jsonp({ message: 'Permiso se registró con éxito', id: ultimo.rows[0].id });
        });
    }
    ObtenerNumPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const NUMERO_PERMISO = yield database_1.default.query('SELECT MAX(p.num_permiso) FROM permisos AS p, empl_contratos AS ec, empleados AS e WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
            if (NUMERO_PERMISO.rowCount > 0) {
                return res.jsonp(NUMERO_PERMISO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' }).end;
            }
        });
    }
    ObtenerPermisoContrato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_empl_contrato } = req.params;
                const PERMISO = yield database_1.default.query('SELECT * FROM VistaNombrePermiso  WHERE id_empl_contrato = $1', [id_empl_contrato]);
                return res.jsonp(PERMISO.rows);
            }
            catch (error) {
                return res.jsonp(null);
            }
        });
    }
    getDoc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = req.params.docs;
            let filePath = `servidor\\docRespaldosPermisos\\${docs}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    guardarDocumentoPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let doc = list.uploads[0].path.split("\\")[1];
            let id = req.params.id;
            yield database_1.default.query('UPDATE permisos SET documento = $2 WHERE id = $1', [id, doc]);
            res.jsonp({ message: 'Documento Actualizado' });
        });
    }
    ActualizarEstado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { estado } = req.body;
            yield database_1.default.query('UPDATE permisos SET estado = $1 WHERE id = $2', [estado, id]);
            res.json({ message: 'Estado de permiso actualizado exitosamente' });
        });
    }
}
exports.PERMISOS_CONTROLADOR = new PermisosControlador();
exports.default = exports.PERMISOS_CONTROLADOR;
