import { Request, Response } from 'express';
import pool from '../../database';

class PlanHoraExtraControlador {

    public async ListarPlanHoraExtra(req: Request, res: Response) {
        const PLAN = await pool.query('SELECT e.id AS empl_id, e.codigo, e.cedula, e.nombre, e.apellido, ' +
            't.id_empl_cargo, t.id_empl_contrato, t.id_plan_extra, t.tiempo_autorizado, t.fecha_desde, t.fecha_hasta, ' +
            't.hora_inicio, t.hora_fin, (t.h_fin::interval - t.h_inicio::interval)::time AS hora_total_plan, ' +
            't.fecha_timbre, t.timbre_entrada, t.timbre_salida, ' +
            '(t.timbre_salida::interval - t.timbre_entrada::interval)::time AS hora_total_timbre, t.observacion, ' +
            't.estado AS plan_estado ' +
            'FROM empleados AS e, (SELECT * FROM timbres_entrada_plan_hora_extra AS tehe ' +
            'FULL JOIN timbres_salida_plan_hora_extra AS tshe ' +
            'ON tehe.fecha_timbre_e = tshe.fecha_timbre AND tehe.id_empl = tshe.id_empleado) AS t ' +
            'WHERE t.observacion = false AND (e.id = t.id_empleado OR e.id = t.id_empl) AND (t.estado = \'1\' OR t.estado = \'2\')');
        if (PLAN.rowCount > 0) {
            res.jsonp(PLAN.rows);
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarPlanHoraExtraObserva(req: Request, res: Response) {
        const PLAN = await pool.query('SELECT e.id AS empl_id, e.codigo, e.cedula, e.nombre, e.apellido, ' +
            't.id_empl_cargo, t.id_empl_contrato, t.id_plan_extra, t.tiempo_autorizado, t.fecha_desde, t.fecha_hasta, ' +
            't.hora_inicio, t.hora_fin, (t.h_fin::interval - t.h_inicio::interval)::time AS hora_total_plan, ' +
            't.fecha_timbre, t.timbre_entrada, t.timbre_salida, ' +
            '(t.timbre_salida::interval - t.timbre_entrada::interval)::time AS hora_total_timbre, t.observacion, ' +
            't.estado AS plan_estado ' +
            'FROM empleados AS e, (SELECT * FROM timbres_entrada_plan_hora_extra AS tehe ' +
            'FULL JOIN timbres_salida_plan_hora_extra AS tshe ' +
            'ON tehe.fecha_timbre_e = tshe.fecha_timbre AND tehe.id_empl = tshe.id_empleado) AS t ' +
            'WHERE t.observacion = true AND (e.id = t.id_empleado OR e.id = t.id_empl) AND (t.estado = \'1\' OR t.estado = \'2\')');
        if (PLAN.rowCount > 0) {
            res.jsonp(PLAN.rows);
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPlanHoraExtra(req: Request, res: Response) {
        const { id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio,
            hora_fin, descripcion, horas_totales, estado, observacion, justifica, id_empl_cargo, id_empl_contrato } = req.body;
        await pool.query('INSERT INTO plan_hora_extra (id_empl_planifica, id_empl_realiza, fecha_desde, ' +
            'fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado, observacion, justifica, ' +
            'id_empl_cargo, id_empl_contrato) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
            [id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta,
                hora_inicio, hora_fin, descripcion, horas_totales, estado, observacion, justifica, id_empl_cargo, id_empl_contrato]);
        res.jsonp({ message: 'Planificacion registrada' });
    }

    public async TiempoAutorizado(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const { hora } = req.body;
        let respuesta = await pool.query('UPDATE plan_hora_extra SET tiempo_autorizado = $2 WHERE id = $1', [id, hora]).then(result => {
            return { message: 'Tiempo de hora autorizada confirmada' }
        });
        res.jsonp(respuesta)
    }
}

export const PLAN_HORA_EXTRA_CONTROLADOR = new PlanHoraExtraControlador();

export default PLAN_HORA_EXTRA_CONTROLADOR;