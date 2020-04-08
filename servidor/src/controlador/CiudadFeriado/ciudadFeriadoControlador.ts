import { Request, Response } from 'express';
import pool from '../../database';

class CiudadFeriadoControlador {

    public async AsignarCiudadFeriado(req: Request, res: Response): Promise<void> {
        const { id_feriado, id_ciudad } = req.body;
        await pool.query('INSERT INTO ciud_feriados (id_feriado, id_ciudad) VALUES ($1, $2)', [id_feriado, id_ciudad]);
        res.json({ message: 'Ciudad asignada a feriado' });
    }

    public async ObtenerIdCiudades(req: Request, res: Response): Promise<any> {
        const { id_feriado, id_ciudad } = req.body;
        const CIUDAD_FERIADO = await pool.query('SELECT * FROM ciud_feriados WHERE id_feriado = $1 AND id_ciudad = $2', [id_feriado, id_ciudad]);
        if (CIUDAD_FERIADO.rowCount > 0) {
            return res.json(CIUDAD_FERIADO.rows)
        }
        else {
            return res.status(404).json({ text: 'Registros no encontrados' });
        }
    }

    public async FiltrarCiudadesProvincia(req: Request, res: Response): Promise<any> {
        const { nombre } = req.params;
        const CIUDAD_FERIADO = await pool.query('SELECT id, descripcion FROM VistaNombreProvincia WHERE nombre = $1', [nombre]);
        if (CIUDAD_FERIADO.rowCount > 0) {
            return res.json(CIUDAD_FERIADO.rows)
        }
        else {
            return res.status(404).json({ text: 'Registros no encontrados' });
        }
    }

    public async EncontrarCiudadesFeriado(req: Request, res: Response): Promise<any> {
        const { idferiado } = req.params;
        const CIUDAD_FERIADO = await pool.query('SELECT * FROM NombreFeriadoCiudad WHERE idferiado = $1', [idferiado]);
        if (CIUDAD_FERIADO.rowCount > 0) {
            return res.json(CIUDAD_FERIADO.rows)
        }
        else {
            return res.status(404).json({ text: 'Registros no encontrados' });
        }
    }

}

export const CIUDAD_FERIADO_CONTROLADOR = new CiudadFeriadoControlador();

export default CIUDAD_FERIADO_CONTROLADOR;