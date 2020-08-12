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
const database_1 = __importDefault(require("../../../database"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
class EmpleadoHorariosControlador {
    ListarEmpleadoHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIOS = yield database_1.default.query('SELECT * FROM empl_horarios');
            if (HORARIOS.rowCount > 0) {
                return res.jsonp(HORARIOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearEmpleadoHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado } = req.body;
            yield database_1.default.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado]);
            res.jsonp({ message: 'El horario del empleado se registró con éxito' });
        });
    }
    ListarHorarioCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo } = req.params;
            const HORARIOS = yield database_1.default.query('SELECT * FROM VistaHorarioEmpleado WHERE id_empl_cargo = $1', [id_empl_cargo]);
            if (HORARIOS.rowCount > 0) {
                return res.jsonp(HORARIOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearHorarioEmpleadoPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                var { fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
                const id_cargo = yield database_1.default.query('SELECT MAX(ec.id) FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id]);
                var id_empl_cargo = id_cargo.rows[0]['max'];
                ;
                var nombre = nombre_horario;
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
                var id_horarios = idHorario.rows[0]['id'];
                var id_hora = 1;
                yield database_1.default.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado.split("-")[0]]);
                console.log("carga exitosa");
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
    CargarMultiplesHorariosEmpleadosPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                var { cedula, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
                const id_cargo = yield database_1.default.query('SELECT MAX(ecargo.id) FROM empl_cargos AS ecargo, empl_contratos AS econtrato, empleados AS e WHERE econtrato.id_empleado = e.id AND ecargo.id_empl_contrato = econtrato.id AND e.cedula = $1', [cedula]);
                var id_empl_cargo = id_cargo.rows[0]['max'];
                ;
                var nombre = nombre_horario;
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
                var id_horarios = idHorario.rows[0]['id'];
                var id_hora = 1;
                yield database_1.default.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado.split("-")[0]]);
                console.log("carga exitosa");
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
    ObtenerNumeroHoras(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_emple, fecha } = req.body;
            const HORAS = yield database_1.default.query('SELECT * FROM VistaNumeroHoras WHERE id_emple = $1 AND $2 BETWEEN fec_inicio AND fec_final', [id_emple, fecha]);
            if (HORAS.rowCount > 0) {
                return res.jsonp(HORAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    ActualizarEmpleadoHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, id } = req.body;
            yield database_1.default.query('UPDATE empl_horarios SET id_empl_cargo = $1, id_hora = $2, fec_inicio = $3, fec_final = $4, lunes = $5, martes = $6, miercoles = $7, jueves = $8, viernes = $9, sabado = $10, domingo = $11, id_horarios = $12, estado = $13 WHERE id = $14', [id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, id]);
            res.jsonp({ message: 'El horario del empleado se registró con éxito' });
        });
    }
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM empl_horarios WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
}
exports.EMPLEADO_HORARIOS_CONTROLADOR = new EmpleadoHorariosControlador();
exports.default = exports.EMPLEADO_HORARIOS_CONTROLADOR;
