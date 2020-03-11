import { Request, Response, text } from 'express';

import pool from '../../database';

class FeriadosControlador {

    public async ListarFeriados(req: Request, res: Response) {
        const FERIADOS = await pool.query('SELECT * FROM cg_feriados');
        if (FERIADOS.rowCount > 0) {
            return res.json(FERIADOS.rows)
        }
        else {
            res.json({ text: 'No se encuentran registros' });
        }
    }

    public async ListarFeriadoDescripcion(req: Request, res: Response): Promise<any> {
        const { descripcion } = req.params;
        const FERIADOS = await pool.query('SELECT * FROM cg_feriados WHERE descripcion = $1', [descripcion]);
        if (FERIADOS.rowCount > 0) {
            return res.json(FERIADOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ListarFeriadoFecha(req: Request, res: Response): Promise<any> {
        const { fecha } = req.params;
        const FERIADOS = await pool.query('SELECT * FROM cg_feriados WHERE fecha = $1', [fecha]);
        if (FERIADOS.rowCount > 0) {
            return res.json(FERIADOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ActualizarFeriado(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { fecha, descripcion, fec_recuperacion } = req.body;
        await pool.query('UPDATE cg_feriados SET fecha = $1, descripcion = $2, fec_recuperacion = $3 WHERE id = $4', [fecha, descripcion, fec_recuperacion, id]);
        res.json({ message: 'Feriado actualizado exitosamente' });
    }

    public async CrearFeriados(req: Request, res: Response): Promise<void> {
        const { fecha, descripcion, fec_recuperacion } = req.body;
        await pool.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
        res.json({ message: 'Feriado guardado' });
    }
}

const FERIADOS_CONTROLADOR = new FeriadosControlador();

export default FERIADOS_CONTROLADOR;
