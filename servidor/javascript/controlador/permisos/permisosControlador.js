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
                return res.json(PERMISOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion } = req.body;
            yield database_1.default.query('INSERT INTO permisos (fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion]);
            const ultimo = yield database_1.default.query('SELECT id FROM permisos WHERE fec_creacion = $1,  id_tipo_permiso = $2, id_empl_contrato = $3,', [fec_creacion, id_tipo_permiso, id_empl_contrato,]);
            console.log(ultimo.rows[0]);
            res.json({ message: 'Permiso se registró con éxito', id: ultimo.rows[0] });
        });
    }
    getDoc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagen = req.params.imagen;
            let filePath = `servidor\\docRespaldosPermisos\\${imagen}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    guardarDocumentoPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            console.log(list);
            // let imagen = list.image[0].path.split("\\")[1];
            // let id = req.params.id_empleado
            // const unEmpleado = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
            // if (unEmpleado.rowCount > 0) {
            //   unEmpleado.rows.map(async (obj) => {
            //     if (obj.imagen != null ){
            //       try {
            //         console.log(obj.imagen);
            //         let filePath = `servidor\\imagenesEmpleados\\${obj.imagen}`;
            //         let direccionCompleta = __dirname.split("servidor")[0] + filePath;
            //         fs.unlinkSync(direccionCompleta);
            //         await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
            //         res.json({ message: 'Imagen Actualizada'});
            //       } catch (error) {
            //         await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
            //         res.json({ message: 'Imagen Actualizada'});
            //       }
            //     } else {
            //       await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
            //       res.json({ message: 'Imagen Actualizada'});
            //     }
            //   });
            // }
        });
    }
}
exports.PERMISOS_CONTROLADOR = new PermisosControlador();
exports.default = exports.PERMISOS_CONTROLADOR;
