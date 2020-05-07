import { Request, Response } from 'express';
import pool from '../../../database';

class PlanHorarioControlador {

    public async ListarPlanHorario(req: Request, res: Response) {
        const HORARIO = await pool.query('SELECT * FROM plan_horarios');
        if (HORARIO.rowCount > 0) {
            return res.json(HORARIO.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPlanHorario(req: Request, res: Response): Promise<void> {
        const { id_cargo, fec_inicio, fec_final } = req.body;
        await pool.query('INSERT INTO plan_horarios ( id_cargo, fec_inicio, fec_final ) VALUES ($1, $2, $3)', [id_cargo, fec_inicio, fec_final]);
        res.json({ message: 'Plan Horario Registrado' });
    }

    public async EncontrarIdPlanHorario(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const HORARIO = await pool.query('SELECT ph.id FROM plan_horarios AS ph, empl_cargos AS ecargo, empl_contratos AS contratoe, empleados AS e WHERE ph.id_cargo = ecargo.id AND ecargo.id_empl_contrato = contratoe.id AND contratoe.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (HORARIO.rowCount > 0) {
          return res.json(HORARIO.rows)
        }
        res.status(404).json({ text: 'Registro no encontrado' });
    }

    public async EncontrarPlanHorarioPorIdCargo(req: Request, res: Response): Promise<any> {
        const { id_cargo } = req.params;
        const HORARIO_CARGO = await pool.query('SELECT * FROM plan_horarios AS p WHERE p.id_cargo = $1', [id_cargo]);
        if (HORARIO_CARGO.rowCount > 0) {
          return res.json(HORARIO_CARGO.rows)
        }
        res.status(404).json({ text: 'Registro no encontrado' });
    }

}

export const PLAN_HORARIO_CONTROLADOR = new PlanHorarioControlador();

export default PLAN_HORARIO_CONTROLADOR;