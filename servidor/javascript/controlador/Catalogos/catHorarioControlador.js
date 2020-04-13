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
const xlsx_1 = __importDefault(require("xlsx"));
// const xlsxFile = require('read-excel-file/node');
// xlsxFile('./plantillas/horarios.xlsx').then((rows) => {
//   rows.forEach((col)=>{
//     col.forEach((data)=>{
//       console.log(data);
//       // console.log(typeof data);
//     });
//   });
// });
class HorarioControlador {
    ListarHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIOS = yield database_1.default.query('SELECT * FROM cg_horarios ORDER BY nombre ASC');
            if (HORARIOS.rowCount > 0) {
                return res.json(HORARIOS.rows);
            }
            else {
                return res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerUnHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const UN_HORARIO = yield database_1.default.query('SELECT * FROM cg_horarios WHERE id = $1', [id]);
            if (UN_HORARIO.rowCount > 0) {
                return res.json(UN_HORARIO.rows);
            }
            else {
                res.status(404).json({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.file.filename);
            const workbook = xlsx_1.default.readFile(`./plantillas/${req.file.filename}`);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            let obj = [];
            plantilla.forEach(data => {
                obj.push(data);
            });
            //HORA_TRABAJO --SOLO PERMITE 2 Nùmeros 1 entero, un decimal 
            console.log(obj.length);
            for (let i = 0; i <= obj.length; i++) {
                const { nombre, min_almuerzo, hora_trabajo, flexible, por_horas } = obj[i];
                console.log({ nombre, min_almuerzo, hora_trabajo, flexible, por_horas });
                // console.log(flexible);
                yield database_1.default.query('INSERT INTO cg_horarios (nombre, min_almuerzo, hora_trabajo, flexible, por_horas) VALUES ($1, $2, $3, $4, $5)', [nombre, min_almuerzo, hora_trabajo, flexible, por_horas]);
                res.json({ message: 'El horario ha sido registrado' });
            }
            ;
            res.send({
                success: true,
                message: 'file upload'
            });
        });
    }
}
exports.HORARIO_CONTROLADOR = new HorarioControlador();
exports.default = exports.HORARIO_CONTROLADOR;
