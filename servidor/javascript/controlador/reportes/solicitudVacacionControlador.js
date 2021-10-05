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
class SolicitudVacacionesControlador {
    ReporteVacacionesMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('datos recibidos', req.body);
            let datos = req.body;
            let { desde, hasta } = req.params;
            let n = yield Promise.all(datos.map((obj) => __awaiter(this, void 0, void 0, function* () {
                obj.departamentos = yield Promise.all(obj.departamentos.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    ele.empleado = yield Promise.all(ele.empleado.map((o) => __awaiter(this, void 0, void 0, function* () {
                        o.vacaciones = yield BuscarVacaciones(o.codigo, desde, hasta);
                        console.log('Vacaciones: ', o);
                        return o;
                    })));
                    return ele;
                })));
                return obj;
            })));
            let nuevo = n.map((obj) => {
                obj.departamentos = obj.departamentos.map((e) => {
                    e.empleado = e.empleado.filter((v) => { return v.vacaciones.length > 0; });
                    return e;
                }).filter((e) => { return e.empleado.length > 0; });
                return obj;
            }).filter(obj => { return obj.departamentos.length > 0; });
            if (nuevo.length === 0)
                return res.status(400).jsonp({ message: 'No se ha encontrado registro de vacaciones.' });
            return res.status(200).jsonp(nuevo);
        });
    }
}
const VACACIONES_REPORTE_CONTROLADOR = new SolicitudVacacionesControlador();
exports.default = VACACIONES_REPORTE_CONTROLADOR;
const BuscarVacaciones = function (id, desde, hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT v.fec_inicio, v.fec_final, v.fec_ingreso,v.id AS id_vacacion, ' +
            'a.id_documento ' +
            'FROM vacaciones AS v, autorizaciones AS a ' +
            'WHERE v.id = a.id_vacacion AND v.codigo = $1 AND fec_inicio BETWEEN $2 AND $3', [id, desde, hasta])
            .then(res => {
            return res.rows;
        });
    });
};
