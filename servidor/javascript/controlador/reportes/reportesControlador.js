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
const SubMetodosGraficas_1 = require("../../libs/SubMetodosGraficas");
class ReportesControlador {
    ListarDatosContractoA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const DATOS = yield database_1.default.query('SELECT * FROM datos_contrato_actual');
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarDatosCargoA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empleado_id } = req.params;
            const DATOS = yield database_1.default.query('SELECT * FROM datosCargoActual ($1)', [empleado_id]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarEntradaSalidaEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // id_empleado hace referencia al código del empleado
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            const DATOS = yield database_1.default.query('SELECT * FROM TimbresEntrada AS te INNER JOIN TimbresSalida AS ts ' +
                'ON te.id_empleado = ts.id_empleado AND te.fecha_inicio::date = ts.fecha_fin::date AND ' +
                'te.id_empleado = $1 AND te.fecha_inicio::date BETWEEN $2 AND $3', [id_empleado, fechaInicio, fechaFinal]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarPedidosEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usua_solicita } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            const DATOS = yield database_1.default.query('SELECT * FROM hora_extr_pedidos WHERE id_usua_solicita = $1 AND fec_inicio::date BETWEEN $2 AND $3', [id_usua_solicita, fechaInicio, fechaFinal]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarEntradaSalidaTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio, fechaFinal } = req.body;
            const DATOS = yield database_1.default.query('SELECT * FROM TimbresEntrada AS te INNER JOIN TimbresSalida AS ts ' +
                'ON te.id_empleado = ts.id_empleado AND te.fecha_inicio::date = ts.fecha_fin::date AND ' +
                'te.fecha_inicio::date BETWEEN $1 AND $2', [fechaInicio, fechaFinal]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarPedidosTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio, fechaFinal } = req.body;
            const DATOS = yield database_1.default.query('SELECT * FROM hora_extr_pedidos WHERE fec_inicio::date BETWEEN $1 AND $2', [fechaInicio, fechaFinal]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarTimbres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            const DATOS = yield database_1.default.query('SELECT * FROM timbres WHERE id_empleado = $1 AND ' +
                'fec_hora_timbre::date BETWEEN $2 AND $3 ORDER BY fec_hora_timbre::date, fec_hora_timbre::time ASC', [id_empleado, fechaInicio, fechaFinal]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarPermisoHorarioEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const DATOS = yield database_1.default.query('SELECT * FROM permisos AS p INNER JOIN ' +
                '(SELECT h.id_horarios, ch.nombre AS nom_horario, h.id_empl_cargo, ch.hora_trabajo AS horario_horas, ' +
                'cargo.hora_trabaja AS cargo_horas, cargo.cargo, ' +
                'e.id AS id_empleado, e.estado AS estado_empl, contrato.id AS id_contrato, p.fec_inicio AS fecha, p.id AS id_permiso, ' +
                'tp.id AS id_tipo_permiso, tp.descripcion AS nombre_permiso ' +
                'FROM empl_horarios AS h, empl_contratos AS contrato, empl_cargos AS cargo, empleados AS e,  ' +
                'cg_horarios AS ch, ' +
                'permisos AS p, cg_tipo_permisos AS tp ' +
                'WHERE h.id_empl_cargo = cargo.id AND e.id = contrato.id_empleado AND p.id_tipo_permiso = tp.id ' +
                'AND ch.id = h.id_horarios AND p.id_empl_contrato = contrato.id ' +
                'AND p.fec_inicio::date BETWEEN h.fec_inicio AND h.fec_final AND e.id = $1 AND e.estado = 1) AS h ' +
                'ON h.id_permiso = p.id ORDER BY p.num_permiso ASC', [id_empleado]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarPermisoPlanificaEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const DATOS = yield database_1.default.query('SELECT * FROM permisos AS p INNER JOIN ' +
                '(SELECT ph.id AS id_plan, ph.id_cargo, dp.id_cg_horarios, ch.nombre AS nom_horario, ' +
                'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, ' +
                'e.id AS id_empleado, contrato.id AS id_contrato, p.id AS id_permiso, dp.fecha, ' +
                'tp.id AS id_tipo_permiso, tp.descripcion AS nombre_permiso ' +
                'FROM plan_horarios AS ph, empl_cargos AS cargo, empl_contratos AS contrato, empleados AS e, ' +
                'plan_hora_detalles AS dp, cg_horarios AS ch, permisos AS p, cg_tipo_permisos AS tp ' +
                'WHERE cargo.id = ph.id_cargo AND e.id = contrato.id_empleado AND e.id = $1 AND ' +
                'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario AND p.id_tipo_permiso = tp.id ' +
                'AND p.id_empl_contrato = contrato.id AND p.fec_inicio::date BETWEEN ph.fec_inicio AND ' +
                'ph.fec_final AND p.fec_inicio::date = dp.fecha) AS h ' +
                'ON p.id = h.id_permiso ORDER BY p.num_permiso ASC', [id_empleado]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarPermisoHorarioEmpleadoFechas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            const DATOS = yield database_1.default.query('SELECT * FROM permisos AS p INNER JOIN ' +
                '(SELECT h.id_horarios, ch.nombre AS nom_horario, h.id_empl_cargo, ch.hora_trabajo AS horario_horas, ' +
                'cargo.hora_trabaja AS cargo_horas, cargo.cargo, ' +
                'e.id AS id_empleado, e.estado AS estado_empl, contrato.id AS id_contrato, p.fec_inicio AS fecha, p.id AS id_permiso, ' +
                'tp.id AS id_tipo_permiso, tp.descripcion AS nombre_permiso ' +
                'FROM empl_horarios AS h, empl_contratos AS contrato, empl_cargos AS cargo, empleados AS e,  ' +
                'cg_horarios AS ch, ' +
                'permisos AS p, cg_tipo_permisos AS tp ' +
                'WHERE h.id_empl_cargo = cargo.id AND e.id = contrato.id_empleado AND p.id_tipo_permiso = tp.id ' +
                'AND ch.id = h.id_horarios AND p.id_empl_contrato = contrato.id ' +
                'AND p.fec_inicio::date BETWEEN h.fec_inicio AND h.fec_final AND e.id = $1 AND e.estado = 1) AS h ' +
                'ON h.id_permiso = p.id AND (p.fec_inicio::date BETWEEN $2 AND $3 OR ' +
                'p.fec_final::date BETWEEN $2 AND $3) ORDER BY p.num_permiso ASC', [id_empleado, fechaInicio, fechaFinal]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarPermisoPlanificaEmpleadoFechas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            const DATOS = yield database_1.default.query('SELECT * FROM permisos AS p INNER JOIN ' +
                '(SELECT ph.id AS id_plan, ph.id_cargo, dp.id_cg_horarios, ch.nombre AS nom_horario, ' +
                'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, ' +
                'e.id AS id_empleado, contrato.id AS id_contrato, p.id AS id_permiso, dp.fecha, ' +
                'tp.id AS id_tipo_permiso, tp.descripcion AS nombre_permiso ' +
                'FROM plan_horarios AS ph, empl_cargos AS cargo, empl_contratos AS contrato, empleados AS e, ' +
                'plan_hora_detalles AS dp, cg_horarios AS ch, permisos AS p, cg_tipo_permisos AS tp ' +
                'WHERE cargo.id = ph.id_cargo AND e.id = contrato.id_empleado AND e.id = $1 AND ' +
                'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario AND p.id_tipo_permiso = tp.id ' +
                'AND p.id_empl_contrato = contrato.id AND p.fec_inicio::date BETWEEN ph.fec_inicio AND ' +
                'ph.fec_final AND p.fec_inicio::date = dp.fecha) AS h ' +
                'ON p.id = h.id_permiso AND (p.fec_inicio::date BETWEEN $2 AND $3 OR ' +
                'p.fec_final::date BETWEEN $2 AND $3) ORDER BY p.num_permiso ASC', [id_empleado, fechaInicio, fechaFinal]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarPermisoAutorizaEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const DATOS = yield database_1.default.query('SELECT a.id AS id_autoriza, a.estado, a.id_permiso, ' +
                'a.id_documento AS empleado_estado, p.id_empl_contrato, contrato.id_empleado ' +
                'FROM autorizaciones AS a, permisos AS p, empl_contratos AS contrato, empleados AS e ' +
                'WHERE a.id_permiso = p.id AND p.id_empl_contrato = contrato.id AND contrato.id_empleado = e.id AND e.id = $1', [id_empleado]);
            if (DATOS.rowCount > 0) {
                return res.jsonp(DATOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'error' });
            }
        });
    }
    ListarAtrasosHorarioEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            let DATOS = [];
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                DATOS = yield AtrasosTimbresConAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Atrasos Horario Con Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
            else {
                // Resultados de timbres sin acciones
                DATOS = yield AtrasosTimbresSinAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Atrasos Horario Sin Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
        });
    }
    ListarAtrasosPlanificaEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            console.log(req.acciones_timbres);
            let DATOS;
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                DATOS = yield AtrasosTimbresPlanificadosConAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Atrasos Planificacion Con Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
            else {
                // Resultados de timbres sin acciones
                DATOS = yield AtrasosTimbresPlanificadosSinAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Atrasos Planificacion Sin Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
        });
    }
    ListarEntradaSalidaHorarioEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            let DATOS;
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                DATOS = yield EntradaSalidaHorarioConAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Entrada Salidas Horario Con Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
            else {
                // Resultados de timbres sin acciones
                DATOS = yield EntradaSalidaHorarioSinAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Entrada Salidas Horario Sin Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
        });
    }
    ListarEntradaSalidaPlanificaEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            let DATOS;
            //false sin acciones || true con acciones
            if (req.acciones_timbres === true) {
                // Resultados de timbres con 6 y 3 acciones
                DATOS = yield EntradaSalidaPlanificacionConAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Entrada Salidas Planificacion Con Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
            else {
                // Resultados de timbres sin acciones
                DATOS = yield EntradaSalidaPlanificacionSinAcciones(id_empleado, fechaInicio, fechaFinal);
                console.log('Entrada Salidas Planificacion Sin Acciones: ', DATOS);
                if (DATOS.length > 0) {
                    return res.status(200).jsonp(DATOS);
                }
                else {
                    return res.status(404).jsonp({ text: 'Sin registros' });
                }
            }
        });
    }
}
exports.REPORTES_CONTROLADOR = new ReportesControlador();
exports.default = exports.REPORTES_CONTROLADOR;
function AtrasosTimbresConAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT h.id_horarios, ch.nombre AS nom_horario, dh.minu_espera, dh.tipo_accion, dh.hora, ' +
            'h.fec_inicio, h.fec_final, ch.hora_trabajo ' +
            'AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, h.id_empl_cargo AS id_cargo, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM empl_horarios AS h, empl_cargos AS cargo, cg_horarios AS ch, deta_horarios AS dh ' +
            'WHERE h.id_empl_cargo = cargo.id AND ch.id = h.id_horarios AND dh.id_horario = h.id_horarios ' +
            'AND dh.tipo_accion = \'E\') AS h ON e.codigo = $1::varchar(15) AND e.estado_empl = 1 AND cargo_id = h.id_cargo) AS h ' +
            'ON t.id_empleado::varchar(15) = h.codigo AND t.accion IN (\'EoS\',\'E\') AND ' +
            't.fec_hora_timbre::date BETWEEN h.fec_inicio AND h.fec_final AND ' +
            't.fec_hora_timbre::date BETWEEN $2 AND $3 AND ' +
            't.fec_hora_timbre::time > hora_total ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows;
        });
    });
}
function AtrasosTimbresSinAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        let arrayModelado = yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT h.id_horarios, ch.nombre AS nom_horario, dh.minu_espera, dh.tipo_accion, dh.hora, ' +
            'h.fec_inicio, h.fec_final, ch.hora_trabajo ' +
            'AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, h.id_empl_cargo AS id_cargo, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM empl_horarios AS h, empl_cargos AS cargo, cg_horarios AS ch, deta_horarios AS dh ' +
            'WHERE h.id_empl_cargo = cargo.id AND ch.id = h.id_horarios AND dh.id_horario = h.id_horarios ' +
            'AND dh.tipo_accion = \'E\') AS h ON e.codigo = $1::varchar(15) AND e.estado_empl = 1 AND cargo_id = h.id_cargo) AS h ' +
            'ON t.id_empleado::varchar(15) = h.codigo AND ' +
            't.fec_hora_timbre::date BETWEEN h.fec_inicio AND h.fec_final AND ' +
            't.fec_hora_timbre::date BETWEEN $2 AND $3 AND ' +
            't.fec_hora_timbre::time > hora_total ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows;
        });
        if (arrayModelado.length === 0)
            return [];
        return arrayModelado.filter(obj => {
            let h = obj.fec_hora_timbre.toJSON().split('T')[1].split('.')[0];
            // console.log(obj); console.log(h);
            let hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(h) - SubMetodosGraficas_1.HHMMtoSegundos('05:00:00');
            let hora_inicio = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora_total);
            let hora_final = hora_inicio + SubMetodosGraficas_1.HHMMtoSegundos('02:00:00');
            return hora_timbre >= hora_inicio && hora_timbre <= hora_final;
        });
    });
}
function AtrasosTimbresPlanificadosConAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT ph.id AS id_plan, ph.id_cargo, ph.fec_inicio, ph.fec_final, dp.id_cg_horarios, ' +
            'ch.nombre AS nom_horario, dh.hora, dh.minu_espera, dh.id AS id_deta_horario, dh.tipo_accion, ' +
            'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, dp.fecha, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM plan_horarios AS ph, empl_cargos AS cargo, plan_hora_detalles AS dp, cg_horarios AS ch, ' +
            'deta_horarios AS dh ' +
            'WHERE cargo.id = ph.id_cargo AND dh.id_horario = dp.id_cg_horarios AND dh.tipo_accion = \'E\' AND ' +
            'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario) AS ph ' +
            'ON e.codigo = $1::varchar(15) AND cargo_id = ph.id_cargo) AS ph ' +
            'ON t.id_empleado::varchar(15) = ph.codigo AND t.fec_hora_timbre::date BETWEEN $2 AND $3 ' +
            'AND t.accion IN (\'EoS\',\'E\') AND t.fec_hora_timbre::date BETWEEN ph.fec_inicio AND ph.fec_final ' +
            'AND t.fec_hora_timbre::date = fecha AND t.fec_hora_timbre::time > hora_total ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows.map(obj => {
                obj.accion = obj.tipo_accion;
                return obj;
            });
        });
    });
}
function AtrasosTimbresPlanificadosSinAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        let arrayModelado = yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT ph.id AS id_plan, ph.id_cargo, ph.fec_inicio, ph.fec_final, dp.id_cg_horarios, ' +
            'ch.nombre AS nom_horario, dh.hora, dh.minu_espera, dh.id AS id_deta_horario, dh.tipo_accion, ' +
            'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, dp.fecha, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM plan_horarios AS ph, empl_cargos AS cargo, plan_hora_detalles AS dp, cg_horarios AS ch, ' +
            'deta_horarios AS dh ' +
            'WHERE cargo.id = ph.id_cargo AND dh.id_horario = dp.id_cg_horarios AND dh.tipo_accion = \'E\' AND ' +
            'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario) AS ph ' +
            'ON e.codigo = $1::varchar(15) AND cargo_id = ph.id_cargo) AS ph ' +
            'ON t.id_empleado::varchar(15) = ph.codigo AND t.fec_hora_timbre::date BETWEEN $2 AND $3 ' +
            'AND t.accion IN (\'EoS\',\'E\') AND t.fec_hora_timbre::date BETWEEN ph.fec_inicio AND ph.fec_final ' +
            'AND t.fec_hora_timbre::date = fecha AND t.fec_hora_timbre::time > hora_total ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows;
        });
        if (arrayModelado.length === 0)
            return [];
        return arrayModelado.filter(obj => {
            let h = obj.fec_hora_timbre.toJSON().split('T')[1].split('.')[0];
            // console.log(obj); console.log(h);
            let hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(h) - SubMetodosGraficas_1.HHMMtoSegundos('05:00:00');
            let hora_inicio = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora_total);
            let hora_final = hora_inicio + SubMetodosGraficas_1.HHMMtoSegundos('02:00:00');
            return hora_timbre >= hora_inicio && hora_timbre <= hora_final;
        }).map(obj => {
            obj.accion = obj.tipo_accion;
            return obj;
        });
    });
}
function EntradaSalidaHorarioConAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT h.id_horarios, ch.nombre AS nom_horario, dh.minu_espera, dh.tipo_accion, dh.hora, ' +
            'h.fec_inicio, h.fec_final, ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, ' +
            'cargo.cargo, h.id_empl_cargo AS id_cargo, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM empl_horarios AS h, empl_cargos AS cargo, cg_horarios AS ch, deta_horarios AS dh ' +
            'WHERE h.id_empl_cargo = cargo.id AND ch.id = h.id_horarios AND dh.id_horario = h.id_horarios ) AS h ' +
            'ON e.codigo::int = $1 AND e.estado_empl = 1 AND cargo_id = h.id_cargo) AS h ' +
            'ON t.id_empleado::varchar(15) = h.codigo AND t.fec_hora_timbre::date BETWEEN $2 AND $3 AND ' +
            't.fec_hora_timbre::date BETWEEN h.fec_inicio AND h.fec_final ' +
            'AND t.accion = h.tipo_accion ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows.map(obj => {
                obj.accion = obj.tipo_accion;
                return obj;
            });
        });
    });
}
function EntradaSalidaHorarioSinAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        const arrayModelado = yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT h.id_horarios, ch.nombre AS nom_horario, dh.minu_espera, dh.tipo_accion, dh.hora, ' +
            'h.fec_inicio, h.fec_final, ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, ' +
            'cargo.cargo, h.id_empl_cargo AS id_cargo, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM empl_horarios AS h, empl_cargos AS cargo, cg_horarios AS ch, deta_horarios AS dh ' +
            'WHERE h.id_empl_cargo = cargo.id AND ch.id = h.id_horarios AND dh.id_horario = h.id_horarios ) AS h ' +
            'ON e.codigo::int = $1 AND e.estado_empl = 1 AND cargo_id = h.id_cargo) AS h ' +
            'ON t.id_empleado::varchar(15) = h.codigo AND t.fec_hora_timbre::date BETWEEN $2 AND $3 AND ' +
            't.fec_hora_timbre::date BETWEEN h.fec_inicio AND h.fec_final ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows;
        });
        if (arrayModelado.length === 0)
            return [];
        return arrayModelado.filter(obj => {
            let h = obj.fec_hora_timbre.toJSON().split('T')[1].split('.')[0];
            // console.log(obj); console.log(h);
            let hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(h) - SubMetodosGraficas_1.HHMMtoSegundos('05:00:00');
            let hora_inicio = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora_total);
            let hora_final = hora_inicio + SubMetodosGraficas_1.HHMMtoSegundos('02:00:00');
            return hora_timbre >= hora_inicio && hora_timbre <= hora_final;
        }).map(obj => {
            obj.accion = obj.tipo_accion;
            return obj;
        });
    });
}
function EntradaSalidaPlanificacionConAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT ph.id AS id_plan, ph.id_cargo, ph.fec_inicio, ph.fec_final, dp.id_cg_horarios,' +
            'ch.nombre AS nom_horario, dh.hora, dh.minu_espera, dh.id AS id_deta_horario, dh.tipo_accion, ' +
            'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, dp.fecha, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM plan_horarios AS ph, empl_cargos AS cargo, plan_hora_detalles AS dp, cg_horarios AS ch, ' +
            'deta_horarios AS dh ' +
            'WHERE cargo.id = ph.id_cargo AND dh.id_horario = dp.id_cg_horarios AND ' +
            'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario) AS ph ' +
            'ON e.codigo::int = $1 AND cargo_id = ph.id_cargo) AS ph ' +
            'ON t.id_empleado::varchar(15) = ph.codigo AND t.fec_hora_timbre::date BETWEEN $2 AND $3 ' +
            'AND t.fec_hora_timbre::date BETWEEN ph.fec_inicio AND ph.fec_final ' +
            'AND t.fec_hora_timbre::date = fecha AND ph.tipo_accion = t.accion ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows;
        });
    });
}
function EntradaSalidaPlanificacionSinAcciones(id_empleado, fechaInicio, fechaFinal) {
    return __awaiter(this, void 0, void 0, function* () {
        const arrayModelado = yield database_1.default.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT ph.id AS id_plan, ph.id_cargo, ph.fec_inicio, ph.fec_final, dp.id_cg_horarios,' +
            'ch.nombre AS nom_horario, dh.hora, dh.minu_espera, dh.id AS id_deta_horario, dh.tipo_accion, ' +
            'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, dp.fecha, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM plan_horarios AS ph, empl_cargos AS cargo, plan_hora_detalles AS dp, cg_horarios AS ch, ' +
            'deta_horarios AS dh ' +
            'WHERE cargo.id = ph.id_cargo AND dh.id_horario = dp.id_cg_horarios AND ' +
            'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario) AS ph ' +
            'ON e.codigo::int = $1 AND cargo_id = ph.id_cargo) AS ph ' +
            'ON t.id_empleado::varchar(15) = ph.codigo AND t.fec_hora_timbre::date BETWEEN $2 AND $3 ' +
            'AND t.fec_hora_timbre::date BETWEEN ph.fec_inicio AND ph.fec_final ' +
            'AND t.fec_hora_timbre::date = fecha ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal])
            .then(result => {
            return result.rows;
        });
        if (arrayModelado.length === 0)
            return [];
        return arrayModelado.filter(obj => {
            let h = obj.fec_hora_timbre.toJSON().split('T')[1].split('.')[0];
            // console.log(obj); console.log(h);
            let hora_timbre = SubMetodosGraficas_1.HHMMtoSegundos(h) - SubMetodosGraficas_1.HHMMtoSegundos('05:00:00');
            let hora_inicio = SubMetodosGraficas_1.HHMMtoSegundos(obj.hora_total);
            let hora_final = hora_inicio + SubMetodosGraficas_1.HHMMtoSegundos('02:00:00');
            return hora_timbre >= hora_inicio && hora_timbre <= hora_final;
        }).map(obj => {
            obj.accion = obj.tipo_accion;
            return obj;
        });
    });
}
