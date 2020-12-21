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
exports.GRAFICAS_CONTROLADOR = void 0;
const MetodosGraficas_1 = require("../../libs/MetodosGraficas");
class GraficasControlador {
    AdminHorasExtrasMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empresa = req.id_empresa;
            const fec_final = new Date();
            var fec_inicio = new Date();
            fec_inicio.setUTCDate(1);
            fec_inicio.setUTCMonth(0);
            fec_inicio.setUTCHours(0);
            fec_inicio.setUTCMinutes(0);
            fec_inicio.setUTCSeconds(0);
            fec_final.setUTCHours(0);
            fec_final.setUTCMinutes(0);
            fec_final.setUTCSeconds(0);
            // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
            res.status(200).jsonp({ message: 'Horas Extras micro' });
        });
    }
    AdminHorasExtrasMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            res.status(200).jsonp({ message: 'Horas Extras macro' });
        });
    }
    AdminRetrasosMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empresa = req.id_empresa;
            const fec_final = new Date();
            var fec_inicio = new Date();
            fec_inicio.setUTCDate(1);
            fec_inicio.setUTCMonth(0);
            fec_inicio.setUTCHours(0);
            fec_inicio.setUTCMinutes(0);
            fec_inicio.setUTCSeconds(0);
            fec_final.setUTCHours(0);
            fec_final.setUTCMinutes(0);
            fec_final.setUTCSeconds(0);
            // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
            res.status(200).jsonp({ message: 'Retrasos micro' });
        });
    }
    AdminRetrasosMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            res.status(200).jsonp({ message: 'Retrasos macro' });
        });
    }
    AdminAsistenciaMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empresa = req.id_empresa;
            const fec_final = new Date();
            var fec_inicio = new Date();
            fec_inicio.setUTCDate(1);
            fec_inicio.setUTCMonth(0);
            fec_inicio.setUTCHours(0);
            fec_inicio.setUTCMinutes(0);
            fec_inicio.setUTCSeconds(0);
            fec_final.setUTCHours(0);
            fec_final.setUTCMinutes(0);
            fec_final.setUTCSeconds(0);
            // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
            res.status(200).jsonp({ message: 'Asistencia micro' });
        });
    }
    AdminAsistenciaMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            res.status(200).jsonp({ message: 'Asistencia macro' });
        });
    }
    AdminJornadaHorasExtrasMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empresa = req.id_empresa;
            const fec_final = new Date();
            var fec_inicio = new Date();
            fec_inicio.setUTCDate(1);
            fec_inicio.setUTCMonth(0);
            fec_inicio.setUTCHours(0);
            fec_inicio.setUTCMinutes(0);
            fec_inicio.setUTCSeconds(0);
            fec_final.setUTCHours(0);
            fec_final.setUTCMinutes(0);
            fec_final.setUTCSeconds(0);
            // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
            res.status(200).jsonp({ message: 'Jornada vs Horas Extras micro' });
        });
    }
    AdminJornadaHorasExtrasMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            res.status(200).jsonp({ message: 'Jornada vs Horas Extras macro' });
        });
    }
    AdminTiempoJornadaHorasExtrasMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empresa = req.id_empresa;
            const fec_final = new Date();
            var fec_inicio = new Date();
            fec_inicio.setUTCDate(1);
            fec_inicio.setUTCMonth(0);
            fec_inicio.setUTCHours(0);
            fec_inicio.setUTCMinutes(0);
            fec_inicio.setUTCSeconds(0);
            fec_final.setUTCHours(0);
            fec_final.setUTCMinutes(0);
            fec_final.setUTCSeconds(0);
            // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
            res.status(200).jsonp({ message: 'Tiempo de jornada vs Horas Extras micro' });
        });
    }
    AdminTiempoJornadaHorasExtrasMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            res.status(200).jsonp({ message: 'Tiempo de jornada vs Horas Extras macro' });
        });
    }
    AdminInasistenciaMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empresa = req.id_empresa;
            const fec_final = new Date();
            var fec_inicio = new Date();
            fec_inicio.setUTCDate(1);
            fec_inicio.setUTCMonth(0);
            fec_inicio.setUTCHours(0);
            fec_inicio.setUTCMinutes(0);
            fec_inicio.setUTCSeconds(0);
            fec_final.setUTCHours(0);
            fec_final.setUTCMinutes(0);
            fec_final.setUTCSeconds(0);
            let resultado = yield MetodosGraficas_1.GraficaInasistencia(id_empresa, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    AdminInasistenciaMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            let resultado = yield MetodosGraficas_1.GraficaInasistencia(id_empresa, new Date(fec_inicio), new Date(fec_final));
            res.status(200).jsonp(resultado);
        });
    }
    AdminMarcacionesEmpleadoMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empresa = req.id_empresa;
            const fec_final = new Date();
            var fec_inicio = new Date();
            fec_inicio.setUTCDate(1);
            fec_inicio.setUTCMonth(0);
            fec_inicio.setUTCHours(0);
            fec_inicio.setUTCMinutes(0);
            fec_inicio.setUTCSeconds(0);
            fec_final.setUTCHours(0);
            fec_final.setUTCMinutes(0);
            fec_final.setUTCSeconds(0);
            // let resultado = await GraficaInasistencia(id_empresa, fec_inicio, fec_final)
            res.status(200).jsonp({ message: 'Maraciones empleado micro' });
        });
    }
    AdminMarcacionesEmpleadoMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            res.status(200).jsonp({ message: 'Maraciones empleado macro' });
        });
    }
}
exports.GRAFICAS_CONTROLADOR = new GraficasControlador();
exports.default = exports.GRAFICAS_CONTROLADOR;
