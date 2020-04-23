import { Request, Response } from 'express';
import pool from '../../database';

class EmpresaControlador {

    public async ListarEmpresa(req: Request, res: Response) {
        const EMPRESA = await pool.query('SELECT * FROM cg_empresa ORDER BY nombre ASC');
        if (EMPRESA.rowCount > 0) {
            return res.json(EMPRESA.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearEmpresa(req: Request, res: Response): Promise<void> {
        const { nombre, ruc, direccion, telefono, correo } = req.body;
        await pool.query('INSERT INTO cg_empresa (nombre, ruc, direccion, telefono, correo ) VALUES ($1, $2, $3, $4, $5)', [nombre, ruc, direccion, telefono, correo]);
        res.json({ message: 'La Empresa se registró con éxito' });
    }

}

export const EMPRESA_CONTROLADOR = new EmpresaControlador();

export default EMPRESA_CONTROLADOR;