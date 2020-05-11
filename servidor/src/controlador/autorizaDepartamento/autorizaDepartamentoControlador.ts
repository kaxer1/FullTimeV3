import { Request, Response } from 'express';
import pool from '../../database';

class AutorizaDepartamentoControlador {

    public async ListarAutorizaDepartamento(req: Request, res: Response) {
        const AUTORIZA = await pool.query('SELECT * FROM depa_autorizaciones');
        if (AUTORIZA.rowCount > 0) {
            return res.json(AUTORIZA.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearAutorizaDepartamento(req: Request, res: Response): Promise<void> {
        const { id_departamento, id_empl_cargo, estado } = req.body;
        await pool.query('INSERT INTO depa_autorizaciones (id_departamento, id_empl_cargo, estado) VALUES ($1, $2, $3)', [id_departamento, id_empl_cargo, estado]);
        res.json({ message: 'Autorización se registró con éxito' });
    }

}

export const AUTORIZA_DEPARTAMENTO_CONTROLADOR = new AutorizaDepartamentoControlador();

export default AUTORIZA_DEPARTAMENTO_CONTROLADOR;