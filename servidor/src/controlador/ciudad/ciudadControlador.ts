import { Request, Response } from 'express';
import pool from '../../database';

class CiudadControlador {

    public async ListarNombreCiudad(req: Request, res: Response) {
        const CIUDAD = await pool.query('SELECT * FROM VistaNombreProvincia ORDER BY nombre, descripcion ASC');
        if (CIUDAD.rowCount > 0) {
            return res.json(CIUDAD.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ListarCiudades(req: Request, res: Response) {
        const CIUDAD = await pool.query('SELECT * FROM ciudades');
        if (CIUDAD.rowCount > 0) {
            return res.json(CIUDAD.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ConsularUnaCiudad(req: Request, res: Response): Promise<any> {
        const { id_provincia } = req.params;
        const CIUDAD = await pool.query('SELECT * FROM ciudades WHERE id_provincia = $1', [id_provincia]);
        if (CIUDAD.rowCount > 0) {
            return res.json(CIUDAD.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearCiudad(req: Request, res: Response): Promise<void> {
        const { id_provincia, descripcion } = req.body;
        await pool.query('INSERT INTO ciudades ( id_provincia, descripcion ) VALUES ($1, $2)', [id_provincia, descripcion]);
        res.json({ message: 'Ciudad Registrada' });
    }

}

export const CIUDAD_CONTROLADOR = new CiudadControlador();

export default CIUDAD_CONTROLADOR;