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
            let resultado = yield MetodosGraficas_1.GraficaHorasExtras(id_empresa, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    AdminHorasExtrasMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            let resultado = yield MetodosGraficas_1.GraficaHorasExtras(id_empresa, new Date(fec_inicio), new Date(fec_final));
            res.status(200).jsonp(resultado);
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
            let resultado = yield MetodosGraficas_1.GraficaRetrasos(id_empresa, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    AdminRetrasosMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            let resultado = yield MetodosGraficas_1.GraficaRetrasos(id_empresa, new Date(fec_inicio), new Date(fec_final));
            res.status(200).jsonp(resultado);
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
            let resultado = yield MetodosGraficas_1.GraficaAsistencia(id_empresa, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    AdminAsistenciaMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            let resultado = yield MetodosGraficas_1.GraficaAsistencia(id_empresa, new Date(fec_inicio), new Date(fec_final));
            res.status(200).jsonp(resultado);
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
            let resultado = yield MetodosGraficas_1.GraficaJornada_VS_HorasExtras(id_empresa, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    AdminJornadaHorasExtrasMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            let resultado = yield MetodosGraficas_1.GraficaJornada_VS_HorasExtras(id_empresa, new Date(fec_inicio), new Date(fec_final));
            res.status(200).jsonp(resultado);
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
            let resultado = yield MetodosGraficas_1.GraficaTiempoJornada_VS_HorasExtras(id_empresa, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    AdminTiempoJornadaHorasExtrasMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            let resultado = yield MetodosGraficas_1.GraficaTiempoJornada_VS_HorasExtras(id_empresa, new Date(fec_inicio), new Date(fec_final));
            res.status(200).jsonp(resultado);
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
            let resultado = yield MetodosGraficas_1.GraficaMarcaciones(id_empresa, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    AdminMarcacionesEmpleadoMacro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fec_inicio = req.params.desde;
            const fec_final = req.params.hasta;
            const id_empresa = req.id_empresa;
            let resultado = yield MetodosGraficas_1.GraficaMarcaciones(id_empresa, new Date(fec_inicio), new Date(fec_final));
            res.status(200).jsonp(resultado);
        });
    }
    /**
     *
     * METODOS DE GRAFICAS PARA LOS EMPLEADOS
     *
     */
    EmpleadoHorasExtrasMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empleado = req.userIdEmpleado;
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
            let resultado = yield MetodosGraficas_1.MetricaHorasExtraEmpleado(id_empleado, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    EmpleadoVacacionesMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empleado = req.userIdEmpleado;
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
            let resultado = yield MetodosGraficas_1.MetricaVacacionesEmpleado(id_empleado, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    EmpleadoPermisosMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empleado = req.userIdEmpleado;
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
            let resultado = yield MetodosGraficas_1.MetricaPermisosEmpleado(id_empleado, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
    EmpleadoAtrasosMicro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_empleado = req.userIdEmpleado;
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
            let resultado = yield MetodosGraficas_1.MetricaAtrasosEmpleado(id_empleado, fec_inicio, fec_final);
            res.status(200).jsonp(resultado);
        });
    }
}
exports.GRAFICAS_CONTROLADOR = new GraficasControlador();
exports.default = exports.GRAFICAS_CONTROLADOR;
