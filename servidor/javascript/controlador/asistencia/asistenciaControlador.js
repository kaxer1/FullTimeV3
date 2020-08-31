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
const ContarHoras_1 = require("../../libs/ContarHoras");
class AsistenciaControlador {
    ObtenerHorasTrabajadas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // var a = new Date();
            // var b = new Date();
            // a.setDate(a.getDate() - 10)
            // b.setDate(b.getDate() - 5)
            var { id_empleado, desde, hasta } = req.params;
            let resultado = yield ContarHoras_1.ContarHorasByCargo(parseInt(id_empleado), new Date(desde), new Date(hasta));
            res.jsonp(resultado);
        });
    }
}
const ASISTENCIA_CONTROLADOR = new AsistenciaControlador();
exports.default = ASISTENCIA_CONTROLADOR;
