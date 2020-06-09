import { Request, Response } from 'express';
import pool from '../../database';

class EnroladoRelojControlador {

    public async AsignarRelojEnrolado(req: Request, res: Response): Promise<void> {
        const { id_reloj, id_enrolado } = req.body;
        await pool.query('INSERT INTO relj_enrolados (id_reloj, id_enrolado) VALUES ($1, $2)', [id_reloj, id_enrolado]);
        res.jsonp({ message: 'Empleado enrolado agregado a dispositivo' });
    }

    public async ObtenerIdReloj(req: Request, res: Response): Promise<any> {
        const { id_reloj, id_enrolado } = req.body;
        const ENROLADO_RELOJ = await pool.query('SELECT * FROM relj_enrolados WHERE id_reloj = $1 AND id_enrolado  = $2', [id_reloj, id_enrolado]);
        if (ENROLADO_RELOJ.rowCount > 0) {
            return res.jsonp(ENROLADO_RELOJ.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'Registros no encontrados' });
        }
    }

    public async EncontrarEnroladosReloj(req: Request, res: Response): Promise<any> {
        const { enroladoid } = req.params;
        const ENROLADO_RELOJ = await pool.query('SELECT * FROM NombreEnroladoReloj WHERE enroladoid = $1', [enroladoid]);
        if (ENROLADO_RELOJ.rowCount > 0) {
            return res.jsonp(ENROLADO_RELOJ.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'Registros no encontrados' });
        }
    }

}

export const ENROLADO_RELOJ_CONTROLADOR = new EnroladoRelojControlador();

export default ENROLADO_RELOJ_CONTROLADOR;