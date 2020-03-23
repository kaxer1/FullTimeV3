import { Request, Response, text } from 'express';

import pool from '../../database';

class TipoComidasControlador {

    public async ListarTipoComidas(req: Request, res: Response) {

        const TIPO_COMIDAS = await pool.query('SELECT * FROM cg_tipo_comidas ORDER BY nombre, observacion ASC');
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.json(TIPO_COMIDAS.rows)
        }
        else {
            res.json({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnTipoComida(req: Request, res: Response): Promise<any> {

        const { id } = req.params;
        const TIPO_COMIDAS = await pool.query('SELECT * FROM cg_tipo_comidas WHERE id = $1', [id]);
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.json(TIPO_COMIDAS.rows)
        }
        else {
            res.json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearTipoComidas(req: Request, res: Response): Promise<void> {

        const { nombre, valor, observacion } = req.body;
        await pool.query('INSERT INTO cg_tipo_comidas (nombre, valor, observacion) VALUES ($1, $2, $3)', [nombre, valor, observacion]);
        res.json({ message: 'Tipo de comida registrada' });
    }

}

const TIPO_COMIDAS_CONTROLADOR = new TipoComidasControlador();

export default TIPO_COMIDAS_CONTROLADOR;
