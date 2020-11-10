import { Request, Response } from 'express';
import pool from '../../database';

class PlanGeneralControlador {

    public async CrearPlanificacion(req: Request, res: Response): Promise<void> {
        const { fec_hora_horario, maxi_min_espera, estado, id_det_horario,
            fec_horario, id_empl_cargo, tipo_entr_salida, codigo } = req.body;
        await pool.query('INSERT INTO plan_general (fec_hora_horario, maxi_min_espera, estado, id_det_horario, ' +
            'fec_horario, id_empl_cargo, tipo_entr_salida, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [fec_hora_horario, maxi_min_espera, estado, id_det_horario,
                fec_horario, id_empl_cargo, tipo_entr_salida, codigo]);
        res.jsonp({ message: 'Planificación ha sido guardado con éxito' });
    }


    public async EliminarRegistros(req: Request, res: Response): Promise<void> {
        const codigo = req.params.codigo;
        const { fec_horario } = req.body;
        await pool.query('DELETE FROM plan_general WHERE fec_horario = $1 AND codigo = $2', [fec_horario, codigo]);
        res.jsonp({ message: 'Registro eliminado' });
    }

}

export const PLAN_GENERAL_CONTROLADOR = new PlanGeneralControlador();

export default PLAN_GENERAL_CONTROLADOR;