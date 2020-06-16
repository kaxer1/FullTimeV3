import { Request, Response, text } from 'express'

import pool from '../../database';

class TipoComidasControlador {

    public async ListarTipoComidas(req: Request, res: Response) {
        const TIPO_COMIDAS = await pool.query('SELECT * FROM cg_tipo_comidas ORDER BY nombre, observacion ASC');
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.jsonp(TIPO_COMIDAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnTipoComida(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const TIPO_COMIDAS = await pool.query('SELECT * FROM cg_tipo_comidas WHERE id = $1', [id]);
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.jsonp(TIPO_COMIDAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearTipoComidas(req: Request, res: Response): Promise<void> {
        const { nombre, valor, observacion } = req.body;
        await pool.query('INSERT INTO cg_tipo_comidas (nombre, valor, observacion) VALUES ($1, $2, $3)', [nombre, valor, observacion]);
        res.jsonp({ message: 'Tipo de comida registrada' });
    }

    public async ActualizarComida(req: Request, res: Response): Promise<void> {
        const { nombre, valor, observacion, id } = req.body;
        await pool.query('UPDATE cg_tipo_comidas SET nombre = $1, valor = $2, observacion = $3 WHERE id = $4', [nombre, valor, observacion, id]);
        res.jsonp({ message: 'Feriado actualizado exitosamente' });
    }

}

const TIPO_COMIDAS_CONTROLADOR = new TipoComidasControlador();

export default TIPO_COMIDAS_CONTROLADOR;
