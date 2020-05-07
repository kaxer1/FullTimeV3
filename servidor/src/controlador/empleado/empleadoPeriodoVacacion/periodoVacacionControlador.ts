import { Request, Response } from 'express';
import pool from '../../../database';

class PeriodoVacacionControlador {

    public async ListarPerVacaciones(req: Request, res: Response) {
        const VACACIONES = await pool.query('SELECT * FROM peri_vacaciones');
        if (VACACIONES.rowCount > 0) {
            return res.json(VACACIONES.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPerVacaciones(req: Request, res: Response) {
        const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido } = req.body;
        await pool.query('INSERT INTO peri_vacaciones (id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido]);
        res.json({ message: 'Período de Vacación guardado' });
    }

    public async EncontrarIdPerVacaciones(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const VACACIONES = await pool.query('SELECT pv.id FROM peri_vacaciones AS pv, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND pv.id_empl_contrato = ce.id AND e.id = $1', [id_empleado]);
        if (VACACIONES.rowCount > 0) {
            return res.json(VACACIONES.rows)
        }
        res.status(404).json({ text: 'Registro no encontrado' });
    }

    public async EncontrarPerVacacionesPorIdContrato(req: Request, res: Response): Promise<any> {
        const { id_empl_contrato } = req.params;
        const PERIODO_VACACIONES = await pool.query('SELECT * FROM peri_vacaciones AS p WHERE p.id_empl_contrato = $1', [id_empl_contrato]);
        if (PERIODO_VACACIONES.rowCount > 0) {
            return res.json(PERIODO_VACACIONES.rows)
        }
        res.status(404).json({ text: 'Registro no encontrado' });
    }

}

const PERIODO_VACACION_CONTROLADOR = new PeriodoVacacionControlador();

export default PERIODO_VACACION_CONTROLADOR;