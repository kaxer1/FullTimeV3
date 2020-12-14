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
const DIAS_MES = 30;
exports.CalcularHoraExtra = function (id_empleado, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empleado, fec_desde, fec_hasta);
        let codigo;
        try {
            var code = yield database_1.default.query('SELECT codigo FROM empleados WHERE id = $1', [id_empleado]).then(result => { return result.rows; });
            // console.log('Codigo: ',code);
            if (code.length === 0)
                return { mensaje: 'El empleado no tiene un codigo asignado.' };
            codigo = parseInt(code[0].codigo);
            // console.log('Codigo: ',codigo);
            let ids = yield CargoContratoByFecha(id_empleado, fec_desde, fec_hasta);
            console.log('Contrato y cargo', ids);
            let cg_horas_extras = yield CatalogoHorasExtras();
            console.log('Catalgo Horas Extras', cg_horas_extras);
            let horas_extras = yield Promise.all(ids.map((obj) => __awaiter(this, void 0, void 0, function* () {
                return yield ListaHorasExtras(codigo, obj.id_cargo, fec_desde, fec_hasta);
            })));
            let feriados = yield Promise.all(ids.map((obj) => __awaiter(this, void 0, void 0, function* () {
                return yield FeriadosPorIdCargo(obj.id_cargo, fec_desde, fec_hasta);
            })));
            // console.log('Lista de horas extras ===', horas_extras[0]);
            console.log('Lista de feriados ===', feriados[0]);
            // horas_extras.forEach((obj:any) => {
            //     console.log(obj);
            //     obj.forEach((element:any) => {
            //        element.timbres.forEach((res:any) => {
            //             console.log(res);
            //         }); 
            //     });
            // })
            return horas_extras[0];
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });
};
function FeriadosPorIdCargo(id_cargo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT f.fecha, f.fec_recuperacion, f.descripcion FROM empl_cargos AS ec, sucursales AS s, ciudades AS c, ' +
            'ciud_feriados AS cf, cg_feriados AS f WHERE ec.id = $1 AND ec.id_sucursal = s.id AND s.id_ciudad = c.id AND ' +
            'cf.id_ciudad = s.id AND f.id = cf.id_feriado AND f.fecha between $2 and $3', [id_cargo, fec_desde, fec_hasta])
            .then(result => { return result.rows; });
    });
}
function ListaHorasExtras(codigo, id_cargo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        let arrayUno = yield HorasExtrasSolicitadas(codigo, id_cargo, fec_desde, fec_hasta);
        let arrayDos = yield PlanificacionHorasExtrasSolicitadas(codigo, id_cargo, fec_desde, fec_hasta);
        // console.log('array uno ===', arrayUno); console.log('array dos ===', arrayDos);
        let arrayUnido = arrayUno.concat(arrayDos);
        for (let j = 0; j < arrayUnido.length; j++) {
            let numMin;
            let i = numMin = j;
            for (++i; i < arrayUnido.length; i++) {
                (arrayUnido[i].fec_inicio < arrayUnido[numMin].fec_inicio) && (numMin = i);
            }
            [arrayUnido[j], arrayUnido[numMin]] = [arrayUnido[numMin], arrayUnido[j]];
        }
        console.log('***************** array unido *****************');
        arrayUnido.map(obj => {
            console.log(obj.fec_inicio);
            console.log(obj.fec_inicio.toJSON());
            console.log(obj.fec_inicio.getUTCDay());
        });
        console.log('**********************************************');
        return arrayUnido;
    });
}
function HorasExtrasSolicitadas(id_empleado, id_cargo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT h.fec_inicio, h.fec_final, h.descripcion, h.num_hora, h.tiempo_autorizado ' +
            'FROM hora_extr_pedidos AS h WHERE h.id_empl_cargo = $1 AND h.fec_inicio between $2 and $3 ' +
            'AND h.fec_final between $2 and $3 ORDER BY h.fec_inicio', [id_cargo, fec_desde, fec_hasta])
            .then(result => {
            return Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                var f1 = new Date(obj.fec_inicio);
                var f2 = new Date(obj.fec_final);
                f1.setUTCHours(f1.getUTCHours() - 10);
                f2.setUTCHours(f2.getUTCHours() - 10);
                return {
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: obj.num_hora,
                    tiempo_autorizado: obj.tiempo_autorizado,
                    timbres: yield ObtenerTimbres(id_empleado, f1.toJSON().split('T')[0] + 'T00:00:00', f2.toJSON().split('T')[0] + 'T23:59:59')
                };
            })));
        });
    });
}
function PlanificacionHorasExtrasSolicitadas(id_empleado, id_cargo, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT h.fecha_desde, h.hora_inicio, h.fecha_hasta, h.hora_fin, h.descripcion, h.horas_totales, ph.tiempo_autorizado ' +
            'FROM plan_hora_extra_empleado AS ph, plan_hora_extra AS h WHERE ph.id_empl_cargo = $1 AND ph.id_plan_hora = h.id ' +
            'AND h.fecha_desde between $2 and $3 AND h.fecha_hasta between $2 and $3 ORDER BY h.fecha_desde', [id_cargo, fec_desde, fec_hasta])
            .then(result => {
            return Promise.all(result.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                var f1 = new Date(obj.fecha_desde.toJSON().split('T')[0] + 'T' + obj.hora_inicio);
                var f2 = new Date(obj.fecha_hasta.toJSON().split('T')[0] + 'T' + obj.hora_fin);
                f1.setUTCHours(f1.getUTCHours() - 10);
                f2.setUTCHours(f2.getUTCHours() - 10);
                return {
                    fec_inicio: new Date(f1.toJSON().split('.')[0]),
                    fec_final: new Date(f2.toJSON().split('.')[0]),
                    descripcion: obj.descripcion,
                    num_hora: obj.horas_totales,
                    tiempo_autorizado: obj.tiempo_autorizado,
                    timbres: yield ObtenerTimbres(id_empleado, f1.toJSON().split('T')[0] + 'T00:00:00', f2.toJSON().split('T')[0] + 'T23:59:59')
                };
            })));
        });
    });
}
function ObtenerTimbres(id_empleado, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('$$$$$$$$$$$$', fec_desde, fec_hasta);
        var accion = 'EoS';
        return yield database_1.default.query('SELECT fec_hora_timbre, accion FROM timbres WHERE id_empleado = $1 AND accion = $4 AND fec_hora_timbre BETWEEN $2 AND $3 ORDER BY fec_hora_timbre', [id_empleado, fec_desde, fec_hasta, accion])
            .then(result => {
            return result.rows.map(obj => {
                var f1 = new Date(obj.fec_hora_timbre.toJSON().split('.')[0]);
                f1.setUTCHours(f1.getUTCHours() - 15);
                obj.fec_hora_timbre = new Date(f1.toJSON().split('.')[0]);
                console.log(obj);
                return obj;
            });
        });
    });
}
function CargoContratoByFecha(id_empleado, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let cargo_contrato = yield database_1.default.query('SELECT ca.id AS id_cargo, ca.fec_inicio, ca.fec_final, co.id AS id_contrato, ca.sueldo, ca.hora_trabaja FROM empl_contratos AS co, empl_cargos AS ca ' +
                'WHERE co.id_empleado = $1 AND ca.id_empl_contrato = co.id', [id_empleado])
                .then(result => {
                return result.rows;
            });
            if (cargo_contrato.length === 0)
                return [{ message: 'No tiene contratos ni cargos asignados' }];
            let datos_limpios = cargo_contrato.filter(obj => {
                // console.log('Objeto sin filtrar UNO:',obj);
                return (obj.fec_inicio <= fec_desde && obj.fec_final >= fec_desde);
            }).filter(obj => {
                // console.log('Objeto sin filtrar DOS:',obj);
                return (obj.fec_inicio <= fec_hasta && obj.fec_final >= fec_hasta);
            }).map(obj => {
                // console.log('limpio: ',obj);
                return {
                    id_cargo: obj.id_cargo,
                    id_contrato: obj.id_contrato,
                    sueldo: obj.sueldo,
                    hora_trabaja: obj.hora_trabaja
                };
            });
            return datos_limpios;
        }
        catch (error) {
            return [{ message: error }];
        }
    });
}
/**
 * HE: HORAS EXTRAS
 * RN: RECARGO NOCTURNO
 * LoF: LIBRE o FERIADO
 * N: NORMAL
 */
function CatalogoHorasExtras() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT id, descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia FROM cg_hora_extras').then(result => {
            return result.rows.map(obj => {
                (obj.tipo_descuento === 1) ? obj.tipo_descuento = 'HE' : obj.tipo_descuento = 'RN';
                obj.reca_porcentaje = parseInt(obj.reca_porcentaje) / 100;
                (obj.hora_jornada === 1) ? obj.hora_jornada = 'Diurna' : obj.hora_jornada = 'Nocturna';
                (obj.tipo_dia === 1 || obj.tipo_dia === 2) ? obj.tipo_dia = 'LoF' : obj.tipo_dia = 'N';
                return obj;
            });
        });
    });
}
/**************************************************************************
 *        /\                     _______________  _________
 *       /  \       |          |        |        |         |
 *      /    \      |          |        |        |         |
 *     /      \     |          |        |        |         |
 *    /--------\    |          |        |        |         |
 *   /          \   |          |        |        |         |
 *  /            \  |          |        |        |         |
 * /              \ |__________|        |        |_________|
 ***************************************************************************/
exports.GenerarHoraExtraCalulo = function (id_hora_extr_pedido) {
    return __awaiter(this, void 0, void 0, function* () {
        // let hora_extra_pedida = await pool.query('SELECT fec_inicio, fec_final')
    });
};
