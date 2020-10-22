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
Object.defineProperty(exports, "__esModule", { value: true });
const CalcularVacaciones_1 = require("../../libs/CalcularVacaciones");
const CalcularHorasExtras_1 = require("../../libs/CalcularHorasExtras");
class KardexVacacion {
    CarcularVacacionByIdToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.userIdEmpleado);
            // console.log(req.id_empresa)
            console.log(req.params.desde);
            console.log(req.params.hasta);
            // let fec_desde = new Date(req.params.desde)
            // let fec_hasta = new Date(req.params.hasta)
            let fec_desde = req.params.desde;
            let fec_hasta = req.params.hasta;
            let jsonData = yield CalcularVacaciones_1.vacacionesByIdUser(req.userIdEmpleado, fec_desde, fec_hasta);
            res.jsonp(jsonData);
        });
    }
    CarcularVacacionByIdEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id_empleado = parseInt(req.params.id_empleado);
            // console.log(req.params.desde);
            // console.log(req.params.hasta);
            // console.log(id_empleado)
            // let fec_desde = new Date(req.params.desde)
            // let fec_hasta = new Date(req.params.hasta)
            let fec_desde = req.params.desde;
            let fec_hasta = req.params.hasta;
            let jsonData = yield CalcularVacaciones_1.vacacionesByIdUser(id_empleado, fec_desde, fec_hasta);
            res.jsonp(jsonData);
        });
    }
    CarcularHorasExtras(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id_empleado = parseInt(req.params.id_empleado);
            // console.log(req.params.desde);
            // console.log(req.params.hasta);
            // console.log(id_empleado)
            // let fec_desde = new Date(req.params.desde)
            // let fec_hasta = new Date(req.params.hasta)
            let fec_desde = req.params.desde;
            let fec_hasta = req.params.hasta;
            let jsonData = yield CalcularHorasExtras_1.CalcularHoraExtra(id_empleado, fec_desde, fec_hasta);
            res.jsonp(jsonData);
        });
    }
    ReportePeriodosVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id_empleado = parseInt(req.params.id_empleado);
            console.log('llego a periodo de vacion');
            let jsonData = yield CalcularVacaciones_1.ReportePeriVacaciones(id_empleado);
            res.jsonp(jsonData);
        });
    }
}
exports.KARDEX_VACACION_CONTROLADOR = new KardexVacacion();
exports.default = exports.KARDEX_VACACION_CONTROLADOR;
