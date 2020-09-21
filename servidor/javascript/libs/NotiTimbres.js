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
const MINUTO_TIMER = 59;
exports.NotificacionTimbreAutomatica = function () {
    setInterval(() => __awaiter(this, void 0, void 0, function* () {
        var f = new Date();
        console.log(f.getMinutes());
        if (f.getMinutes() === MINUTO_TIMER) {
            console.log('FECHA:', f.toLocaleDateString(), 'HORA:', f.toLocaleTimeString());
            var d = f.toLocaleDateString().split('-')[2];
            var m = f.toLocaleDateString().split('-')[1];
            var a = f.toLocaleDateString().split('-')[0];
            f.setUTCDate(parseInt(d));
            // f.setUTCDate(15);
            f.setUTCMonth(parseInt(m) - 1);
            f.setUTCFullYear(parseInt(a));
            console.log(f.toJSON());
            let hora = parseInt(f.toLocaleTimeString().split(':')[0]);
            // let hora: number = 9; // =====> solo para probar
            f.setUTCHours(hora);
            console.log(f.toJSON());
            let fecha = f.toJSON().split('T')[0];
            var h = f.toJSON().split('T')[1];
            let retorno = yield CalcularHoras(fecha, h.split(':')[0]);
            console.log(retorno);
        }
    }), 60000);
};
function CalcularHoras(fecha, hora) {
    return __awaiter(this, void 0, void 0, function* () {
        let datoConsulta = fecha + ' ' + hora;
        console.log('FECHA ====>', datoConsulta);
        let timbres = yield database_1.default.query('SELECT fec_hora_timbre, accion, id_empleado, id FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) LIKE $1 || \'%\'', [datoConsulta])
            .then(result => {
            let res = result.rows.map(obj => {
                var f = new Date();
                obj.fec_hora_timbre.setUTCHours(f.getHours());
                // obj.fec_hora_timbre.setUTCHours(9); // =====> solo para probar
                obj.fec_hora_timbre.setUTCDate(f.getDate());
                // obj.fec_hora_timbre.setUTCDate(15);
                obj.fec_hora_timbre.setUTCMonth(f.getMonth());
                obj.fec_hora_timbre.setUTCFullYear(f.getFullYear());
                return obj;
            });
            return res;
        });
        if (timbres.length > 0) {
            timbres.forEach((obj) => __awaiter(this, void 0, void 0, function* () {
                console.log(obj);
                var time = obj.fec_hora_timbre.toJSON().split('T')[1];
                let h = Transformar(time.split('.')[0]);
                // console.log(time);
                // console.log(h);
                let tiempo_horario;
                let estado;
                switch (obj.accion) {
                    case 'E':
                        tiempo_horario = yield HorarioEmpleado(obj.id_empleado, 1);
                        estado = Atrasos(tiempo_horario.tiempo, h);
                        break;
                    case 'S/A':
                        tiempo_horario = yield HorarioEmpleado(obj.id_empleado, 2);
                        estado = SalidasAntes(tiempo_horario.tiempo, h);
                        break;
                    case 'E/A':
                        tiempo_horario = yield HorarioEmpleado(obj.id_empleado, 3);
                        estado = Atrasos(tiempo_horario.tiempo, h);
                        break;
                    case 'S':
                        tiempo_horario = yield HorarioEmpleado(obj.id_empleado, 4);
                        estado = SalidasAntes(tiempo_horario.tiempo, h);
                        break;
                    default:
                        let text = "El timbre es permiso";
                }
                console.log('Tiempo Horario =======>>>>>>>>>>>>>>', tiempo_horario);
                console.log('Estado =======>>>>>>>>>>>>>>', estado);
                if ((estado === null || estado === void 0 ? void 0 : estado.bool) === true) { //es atraso
                    var mensaje = estado === null || estado === void 0 ? void 0 : estado.message;
                    tiempo_horario === null || tiempo_horario === void 0 ? void 0 : tiempo_horario.arrayJefes.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                        yield database_1.default.query('INSERT INTO realtime_timbres(create_at, id_send_empl, id_receives_empl, descripcion, id_timbre) VALUES($1,$2,$3,$4,$5)', [obj.fec_hora_timbre, obj.id_empleado, element.empleado, mensaje, obj.id]);
                    }));
                }
            }));
            return 0;
        }
        return 0;
    });
}
function HorarioEmpleado(id_empleado, orden) {
    return __awaiter(this, void 0, void 0, function* () {
        let IdUltimoContrato = yield database_1.default.query('SELECT id FROM empl_contratos WHERE id_empleado = $1 ORDER BY fec_ingreso DESC LIMIT 1', [id_empleado])
            .then(result => {
            return result.rows[0].id;
        });
        // console.log('id contrato ===>',IdUltimoContrato);
        let UltimoCargo = yield database_1.default.query('SELECT id, id_departamento, id_sucursal FROM empl_cargos WHERE id_empl_contrato = $1 ORDER BY fec_inicio DESC LIMIT 1', [IdUltimoContrato])
            .then(result => { return result.rows[0]; });
        console.log('id cargo ===>', UltimoCargo);
        let IdCgHorario = yield database_1.default.query('SELECT id_horarios FROM empl_horarios WHERE id_empl_cargo = $1 ORDER BY fec_inicio DESC LIMIT 1', [UltimoCargo.id])
            .then(result => { return result.rows[0].id_horarios; });
        // console.log('id Catalogo Horario ===>',IdCgHorario);
        let hora_detalle = yield database_1.default.query('SELECT hora, minu_espera FROM deta_horarios WHERE id_horario = $1 AND orden = $2', [IdCgHorario, orden])
            .then(result => {
            return result.rows.map(obj => {
                return HoraTotal(obj.hora, obj.minu_espera);
            });
        });
        // console.log('Hora detalle ===>',hora_detalle);
        const JefesDepartamentos = yield database_1.default.query('SELECT da.estado, cg.id AS id_dep, cg.depa_padre, cg.nivel, s.id AS id_suc, e.id AS empleado FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.estado = true AND da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id ', [UltimoCargo.id_departamento])
            .then(result => { return result.rows; });
        let depa_padre = JefesDepartamentos[0].depa_padre;
        let JefeDepaPadre;
        if (depa_padre !== null) {
            console.log('ID PADRE >>>>>>>>>>>>>>>>>>>', depa_padre);
            do {
                JefeDepaPadre = yield database_1.default.query('SELECT da.estado, cg.id AS id_dep, cg.depa_padre, cg.nivel, s.id AS id_suc, e.id AS empleado FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.estado = true AND da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id', [depa_padre])
                    .then(result => { return result.rows; });
                if (JefeDepaPadre.length > 0) {
                    depa_padre = JefeDepaPadre[0].depa_padre;
                    JefesDepartamentos.push(JefeDepaPadre[0]);
                }
                else {
                    depa_padre = null;
                }
            } while (depa_padre !== null || JefeDepaPadre.length !== 0);
        }
        return {
            tiempo: hora_detalle[0],
            arrayJefes: JefesDepartamentos
        };
    });
}
function HoraTotal(hora, minu_espera) {
    let total = Transformar(hora) + Transformar(minu_espera);
    return total;
}
function Transformar(tiempo) {
    let h = parseInt(tiempo.split(':')[0]);
    let m = parseInt(tiempo.split(':')[1]);
    return h + (m / 60);
}
function Atrasos(hora, hora_timbre) {
    console.log('**************************', hora, '===', hora_timbre);
    if (hora_timbre > hora) {
        return { bool: true, message: 'Llego atrasado' };
    }
    return { bool: false, message: 'Llego a tiempo' };
}
function SalidasAntes(hora, hora_timbre) {
    console.log('**************************', hora, '===', hora_timbre);
    if (hora_timbre < hora) {
        return { bool: true, message: 'Salio antes' };
    }
    return { bool: false, message: 'Salio despues' };
}