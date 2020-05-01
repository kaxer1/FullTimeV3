import { Request, Response, text } from 'express';

import pool from '../../database';

class RelojesControlador {

    public async ListarRelojes(req: Request, res: Response) {
        const RELOJES = await pool.query('SELECT * FROM NombreDispositivos');
        if (RELOJES.rowCount > 0) {
            return res.json(RELOJES.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnReloj(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const RELOJES = await pool.query('SELECT * FROM cg_relojes WHERE id = $1', [id]);
        if (RELOJES.rowCount > 0) {
            return res.json(RELOJES.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearRelojes(req: Request, res: Response): Promise<void> {
        const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento } = req.body;
        await pool.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento]);
        res.json({ message: 'Reloj Guardado' });
    }

}

const RELOJES_CONTROLADOR = new RelojesControlador();

export default RELOJES_CONTROLADOR;
