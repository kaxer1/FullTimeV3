import { Request, Response } from 'express';
import pool from '../../database';

class ReportesControlador {

    public async ListarDatosContractoA(req: Request, res: Response) {
        const DATOS = await pool.query('SELECT * FROM datos_contrato_actual');
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarDatosCargoA(req: Request, res: Response) {
        const { empleado_id } = req.params;
        const DATOS = await pool.query('SELECT * FROM datosCargoActual ($1)', [empleado_id]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarEntradaSalidaEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM TimbresEntrada AS te INNER JOIN TimbresSalida AS ts ' +
            'ON te.id_empleado = ts.id_empleado AND te.fecha_inicio::date = ts.fecha_fin::date AND ' +
            'te.id_empleado = $1 AND te.fecha_inicio::date BETWEEN $2 AND $3', [id_empleado, fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarPedidosEmpleado(req: Request, res: Response) {
        const { id_usua_solicita } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM hora_extr_pedidos WHERE id_usua_solicita = $1 AND fec_inicio::date BETWEEN $2 AND $3', [id_usua_solicita, fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarEntradaSalidaTodos(req: Request, res: Response) {
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM TimbresEntrada AS te INNER JOIN TimbresSalida AS ts ' +
            'ON te.id_empleado = ts.id_empleado AND te.fecha_inicio::date = ts.fecha_fin::date AND ' +
            'te.fecha_inicio::date BETWEEN $1 AND $2', [fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarPedidosTodos(req: Request, res: Response) {
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM hora_extr_pedidos WHERE fec_inicio::date BETWEEN $1 AND $2', [fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarTimbres(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM timbres WHERE id_empleado = $1 AND ' +
            'fec_hora_timbre::date BETWEEN $2 AND $3 ORDER BY fec_hora_timbre::date ASC', [id_empleado, fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarPermisoHorarioEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const DATOS = await pool.query('SELECT * FROM permisos AS p INNER JOIN ' +
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
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarPermisoPlanificaEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const DATOS = await pool.query('SELECT * FROM permisos AS p INNER JOIN ' +
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
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarPermisoHorarioEmpleadoFechas(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM permisos AS p INNER JOIN ' +
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
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarPermisoPlanificaEmpleadoFechas(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM permisos AS p INNER JOIN ' +
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
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarPermisoAutorizaEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const DATOS = await pool.query('SELECT a.id AS id_autoriza, a.estado, a.id_permiso, p.id_empl_contrato, contrato.id_empleado ' +
            'FROM autorizaciones AS a, permisos AS p, empl_contratos AS contrato, empleados AS e ' +
            'WHERE a.id_permiso = p.id AND p.id_empl_contrato = contrato.id AND contrato.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarAtrasosHorarioEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT h.id_horarios, ch.nombre AS nom_horario, dh.minu_espera, dh.tipo_accion, dh.hora, ' +
            'h.fec_inicio, h.fec_final, ch.hora_trabajo ' +
            'AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, h.id_empl_cargo AS id_cargo, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM empl_horarios AS h, empl_cargos AS cargo, cg_horarios AS ch, deta_horarios AS dh ' +
            'WHERE h.id_empl_cargo = cargo.id AND ch.id = h.id_horarios AND dh.id_horario = h.id_horarios ' +
            'AND dh.tipo_accion = \'E\') AS h ON e.empl_id = $1 AND e.estado_empl = 1 AND cargo_id = h.id_cargo) AS h ' +
            'ON t.id_empleado = h.empl_id AND t.accion LIKE \'E\' AND ' +
            't.fec_hora_timbre::date BETWEEN h.fec_inicio AND h.fec_final AND ' +
            't.fec_hora_timbre::date BETWEEN $2 AND $3 AND ' +
            't.fec_hora_timbre::time > hora_total ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'Sin registros' });
        }
    }

    public async ListarAtrasosPlanificaEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT ph.id AS id_plan, ph.id_cargo, ph.fec_inicio, ph.fec_final, dp.id_cg_horarios, ' +
            'ch.nombre AS nom_horario, dh.hora, dh.minu_espera, dh.id AS id_deta_horario, dh.tipo_accion, ' +
            'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, dp.fecha, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM plan_horarios AS ph, empl_cargos AS cargo, plan_hora_detalles AS dp, cg_horarios AS ch, ' +
            'deta_horarios AS dh ' +
            'WHERE cargo.id = ph.id_cargo AND dh.id_horario = dp.id_cg_horarios AND dh.tipo_accion = \'E\' AND ' +
            'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario) AS ph ' +
            'ON e.empl_id = $1 AND cargo_id = ph.id_cargo) AS ph ' +
            'ON t.id_empleado = ph.empl_id AND t.fec_hora_timbre::date BETWEEN $2 AND $3 ' +
            'AND t.accion LIKE \'E\' AND t.fec_hora_timbre::date BETWEEN ph.fec_inicio AND ph.fec_final ' +
            'AND t.fec_hora_timbre::date = fecha AND t.fec_hora_timbre::time > hora_total ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarEntradaSalidaHorarioEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT h.id_horarios, ch.nombre AS nom_horario, dh.minu_espera, dh.tipo_accion, dh.hora, ' +
            'h.fec_inicio, h.fec_final, ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, ' +
            'cargo.cargo, h.id_empl_cargo AS id_cargo, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM empl_horarios AS h, empl_cargos AS cargo, cg_horarios AS ch, deta_horarios AS dh ' +
            'WHERE h.id_empl_cargo = cargo.id AND ch.id = h.id_horarios AND dh.id_horario = h.id_horarios ) AS h ' +
            'ON e.empl_id = $1 AND e.estado_empl = 1 AND cargo_id = h.id_cargo) AS h ' +
            'ON t.id_empleado = h.empl_id AND t.fec_hora_timbre::date BETWEEN $2 AND $3 AND ' +
            't.fec_hora_timbre::date BETWEEN h.fec_inicio AND h.fec_final ' +
            'AND t.accion = h.tipo_accion ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarEntradaSalidaPlanificaEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params;
        const { fechaInicio, fechaFinal } = req.body;
        const DATOS = await pool.query('SELECT * FROM timbres AS t INNER JOIN ' +
            '(SELECT * FROM datos_empleado_cargo AS e INNER JOIN ' +
            '(SELECT ph.id AS id_plan, ph.id_cargo, ph.fec_inicio, ph.fec_final, dp.id_cg_horarios,' +
            'ch.nombre AS nom_horario, dh.hora, dh.minu_espera, dh.id AS id_deta_horario, dh.tipo_accion, ' +
            'ch.hora_trabajo AS horario_horas, cargo.hora_trabaja AS cargo_horas, cargo.cargo, dp.fecha, ' +
            '(dh.hora + rpad((dh.minu_espera)::varchar(2),6,\' min\')::INTERVAL) AS hora_total ' +
            'FROM plan_horarios AS ph, empl_cargos AS cargo, plan_hora_detalles AS dp, cg_horarios AS ch, ' +
            'deta_horarios AS dh ' +
            'WHERE cargo.id = ph.id_cargo AND dh.id_horario = dp.id_cg_horarios AND ' +
            'ch.id = dp.id_cg_horarios AND ph.id = dp.id_plan_horario) AS ph ' +
            'ON e.empl_id = $1 AND cargo_id = ph.id_cargo) AS ph ' +
            'ON t.id_empleado = ph.empl_id AND t.fec_hora_timbre::date BETWEEN $2 AND $3 ' +
            'AND t.fec_hora_timbre::date BETWEEN ph.fec_inicio AND ph.fec_final ' +
            'AND t.fec_hora_timbre::date = fecha AND ph.tipo_accion = t.accion ' +
            'ORDER BY t.fec_hora_timbre ASC', [id_empleado, fechaInicio, fechaFinal]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }
}

export const REPORTES_CONTROLADOR = new ReportesControlador();

export default REPORTES_CONTROLADOR;