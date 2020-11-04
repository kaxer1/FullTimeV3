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
class DatosGeneralesControlador {
    ListarDatosEmpleadoAutoriza(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empleado_id } = req.params;
            const DATOS = yield database_1.default.query('SELECT * FROM datosCargoActual ($1)', [empleado_id]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarDatosActualesEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const DATOS = yield database_1.default.query('SELECT e_datos.id, e_datos.cedula, e_datos.apellido, e_datos.nombre, ' +
                'e_datos.esta_civil, e_datos.genero, e_datos.correo, e_datos.fec_nacimiento, e_datos.estado, ' +
                'e_datos.mail_alternativo, e_datos.domicilio, e_datos.telefono, e_datos.id_nacionalidad, ' +
                'e_datos.imagen, e_datos.codigo, e_datos.id_contrato, e_datos.regimen, e_datos.id_cargo, c.cargo, ' +
                'c.id_departamento, d.nombre AS departamento, c.id_sucursal, s.nombre AS sucursal, s.id_empresa, ' +
                'empre.nombre AS empresa, s.id_ciudad, ciudades.descripcion AS ciudad ' +
                'FROM datos_actuales_empleado AS e_datos, empl_cargos AS c, cg_departamentos AS d, sucursales AS s, ' +
                'cg_empresa AS empre, ciudades ' +
                'WHERE c.id = e_datos.id_cargo AND d.id = c.id_departamento AND s.id = c.id_sucursal AND ' +
                's.id_empresa = empre.id AND ciudades.id = s.id_ciudad');
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
}
const DATOS_GENERALES_CONTROLADOR = new DatosGeneralesControlador();
exports.default = DATOS_GENERALES_CONTROLADOR;
