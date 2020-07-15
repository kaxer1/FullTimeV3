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
class DetallePlanHorarioControlador {
    ListarDetallePlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIO = yield database_1.default.query('SELECT * FROM plan_hora_detalles');
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearDetallePlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha, id_plan_horario, tipo_dia, id_cg_horarios } = req.body;
            yield database_1.default.query('INSERT INTO plan_hora_detalles ( fecha, id_plan_horario, tipo_dia, id_cg_horarios ) VALUES ($1, $2, $3, $4)', [fecha, id_plan_horario, tipo_dia, id_cg_horarios]);
            res.jsonp({ message: 'Detalle Plan Horario Registrado' });
        });
    }
    EncontrarPlanHoraDetallesPorIdPlanHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_plan_horario } = req.params;
            const HORARIO_CARGO = yield database_1.default.query('SELECT p.id, p.fecha, p.id_plan_horario, p.tipo_dia, h.nombre AS horarios FROM plan_hora_detalles AS p, cg_horarios AS h WHERE p.id_plan_horario = $1 AND p.id_cg_horarios = h.id ', [id_plan_horario]);
            if (HORARIO_CARGO.rowCount > 0) {
                return res.jsonp(HORARIO_CARGO.rows);
            }
            res.status(404).jsonp({ text: 'Registro no encontrado' });
        });
    }
    CrearDetallePlanificacionPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { id_plan_horario } = req.params;
                const { fecha_inicio_actividades, tipo_dia, nombre_horario } = data;
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre_horario]);
                if (fecha_inicio_actividades != undefined) {
                    yield database_1.default.query('INSERT INTO plan_hora_detalles (fecha, id_plan_horario, tipo_dia, id_cg_horarios) VALUES ($1, $2, $3, $4)', [fecha_inicio_actividades, id_plan_horario, tipo_dia.split(" ")[0], idHorario.rows[0]['id']]);
                }
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            fs_1.default.unlinkSync(filePath);
        });
    }
}
exports.DETALLE_PLAN_HORARIO_CONTROLADOR = new DetallePlanHorarioControlador();
exports.default = exports.DETALLE_PLAN_HORARIO_CONTROLADOR;
