import { Request, Response } from 'express';
import pool from '../../../database';

class DetallePlanHorarioControlador {

    public async ListarDetallePlanHorario(req: Request, res: Response) {
        const HORARIO = await pool.query('SELECT * FROM plan_hora_detalles');
        if (HORARIO.rowCount > 0) {
            return res.json(HORARIO.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearDetallePlanHorario(req: Request, res: Response): Promise<void> {
        const { fecha, id_plan_horario, tipo_dia, id_cg_horarios } = req.body;
        await pool.query('INSERT INTO plan_hora_detalles ( fecha, id_plan_horario, tipo_dia, id_cg_horarios ) VALUES ($1, $2, $3, $4)', [fecha, id_plan_horario, tipo_dia, id_cg_horarios]);
        res.json({ message: 'Detalle Plan Horario Registrado' });
    }

}

export const DETALLE_PLAN_HORARIO_CONTROLADOR = new DetallePlanHorarioControlador();

export default DETALLE_PLAN_HORARIO_CONTROLADOR;