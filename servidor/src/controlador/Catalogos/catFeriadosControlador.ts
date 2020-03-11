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

    public async ListarUnFeriado(req: Request, res: Response): Promise<any> {

        const { id } = req.params;
        const FERIADOS = await pool.query('SELECT * FROM cg_feriados WHERE id = $1', [id]);
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

    public async CrearFeriados(req: Request, res: Response): Promise<void> {

        const { fecha, descripcion, fec_recuperacion } = req.body;
        await pool.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
        console.log(req.body);
        res.json({ message: 'Feriado guardado' });
    }
}

const FERIADOS_CONTROLADOR = new FeriadosControlador();

export default FERIADOS_CONTROLADOR;
