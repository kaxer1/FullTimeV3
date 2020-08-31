import { Request, Response } from 'express';
import pool from '../../database';

class PlanHoraExtraControlador {

    public async ListarPlanHoraExtra(req: Request, res: Response) {
        const PLAN = await pool.query('SELECT * FROM plan_hora_extra ORDER BY fecha_desde ASC');
        if (PLAN.rowCount > 0) {
            res.jsonp(PLAN.rows);
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPlanHoraExtra(req: Request, res: Response) {
        const { id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado } = req.body;
        await pool.query('INSERT INTO plan_hora_extra (id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id_empl_planifica, id_empl_realiza, fecha_desde, fecha_hasta, hora_inicio, hora_fin, descripcion, horas_totales, estado]);
        res.jsonp({ message: 'Planificacion registrada' });
    }
}

export const PLAN_HORA_EXTRA_CONTROLADOR = new PlanHoraExtraControlador();

export default PLAN_HORA_EXTRA_CONTROLADOR;