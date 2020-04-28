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

}

const PERIODO_VACACION_CONTROLADOR = new PeriodoVacacionControlador();

export default PERIODO_VACACION_CONTROLADOR;