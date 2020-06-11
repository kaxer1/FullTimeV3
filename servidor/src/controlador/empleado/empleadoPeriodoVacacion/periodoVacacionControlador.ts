import { Request, Response } from 'express';
import pool from '../../../database';

class PeriodoVacacionControlador {

    public async ListarPerVacaciones(req: Request, res: Response) {
        const VACACIONES = await pool.query('SELECT * FROM peri_vacaciones');
        if (VACACIONES.rowCount > 0) {
            return res.jsonp(VACACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPerVacaciones(req: Request, res: Response) {
        const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido } = req.body;
        await pool.query('INSERT INTO peri_vacaciones (id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido]);
        res.jsonp({ message: 'Período de Vacación guardado' });
    }

    public async EncontrarIdPerVacaciones(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const VACACIONES = await pool.query('SELECT pv.id FROM peri_vacaciones AS pv, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND pv.id_empl_contrato = ce.id AND e.id = $1', [id_empleado]);
        if (VACACIONES.rowCount > 0) {
            return res.jsonp(VACACIONES.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async EncontrarPerVacacionesPorIdContrato(req: Request, res: Response): Promise<any> {
        const { id_empl_contrato } = req.params;
        const PERIODO_VACACIONES = await pool.query('SELECT * FROM peri_vacaciones AS p WHERE p.id_empl_contrato = $1', [id_empl_contrato]);
        if (PERIODO_VACACIONES.rowCount > 0) {
            return res.jsonp(PERIODO_VACACIONES.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async ActualizarPeriodo(req: Request, res: Response): Promise<any> {
        const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, id } = req.body;
        await pool.query('UPDATE peri_vacaciones SET id_empl_contrato = $1, descripcion = $2, dia_vacacion = $3 , dia_antiguedad = $4, estado = $5, fec_inicio = $6, fec_final = $7, dia_perdido = $8 WHERE id = $9', [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, id]);
        res.jsonp({ message: 'Registro Actualizado exitosamente' });
    }

}

const PERIODO_VACACION_CONTROLADOR = new PeriodoVacacionControlador();

export default PERIODO_VACACION_CONTROLADOR;