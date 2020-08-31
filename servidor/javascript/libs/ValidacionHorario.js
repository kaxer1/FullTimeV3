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
const database_1 = __importDefault(require("../database"));
function sumaDias(fecha, dias) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}
function restaDias(fecha, dias) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}
function ObtenerRangoSemanal(fHoy) {
    fHoy.setUTCHours(0);
    fHoy.setUTCMinutes(0);
    var fechaInicio = new Date(fHoy);
    var fechaFinal = new Date(fHoy);
    let dia_suma = sumaDias(fechaFinal, 6 - fHoy.getDay());
    let dia_resta = restaDias(fechaInicio, fHoy.getDay());
    return {
        inicio: dia_resta,
        final: dia_suma
    };
}
function HorarioEmpleado(id_cargo, dia_inicia_semana) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT lunes, martes, miercoles, jueves, viernes, sabado, domingo FROM empl_horarios WHERE id_empl_cargo = $1 AND CAST(fec_inicio AS VARCHAR) like $2 || \'%\' ORDER BY fec_inicio ASC', [id_cargo, dia_inicia_semana])
            .then(result => {
            return result.rows;
        });
    });
}
exports.ValidarHorarioEmpleado = function (id_empleado, id_cargo) {
    return __awaiter(this, void 0, void 0, function* () {
        var f = new Date();
        f.setHours(0);
        let diaInicioSemana = ObtenerRangoSemanal(f);
        let fechaIterada = new Date(diaInicioSemana.inicio);
        let diasLabora = yield HorarioEmpleado(id_cargo, diaInicioSemana.inicio.toJSON().split('T')[0]);
        let respuesta = [];
        let dataEstructurada = [];
        diasLabora.forEach((obj) => {
            let con = 0;
            for (let i = diaInicioSemana.inicio.getDate(); i <= diaInicioSemana.final.getDate(); i++) {
                fechaIterada.setDate(i);
                if (con === 0) {
                    respuesta.push(obj.lunes);
                }
                else if (con === 1) {
                    respuesta.push(obj.martes);
                }
                else if (con === 2) {
                    respuesta.push(obj.miercoles);
                }
                else if (con === 3) {
                    respuesta.push(obj.jueves);
                }
                else if (con === 4) {
                    respuesta.push(obj.viernes);
                }
                else if (con === 5) {
                    respuesta.push(obj.sabado);
                }
                else if (con === 6) {
                    respuesta.push(obj.domingo);
                }
                dataEstructurada.push({
                    fec_iterada: fechaIterada.toJSON().split('T')[0],
                    boolena_fecha: respuesta[con]
                });
                con = con + 1;
            }
        });
        return dataEstructurada;
    });
};
