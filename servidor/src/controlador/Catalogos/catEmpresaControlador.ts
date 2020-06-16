import { Request, Response } from 'express'
import pool from '../../database';

class EmpresaControlador {

    public async ListarEmpresa(req: Request, res: Response) {
        const EMPRESA = await pool.query('SELECT * FROM cg_empresa ORDER BY nombre ASC');
        if (EMPRESA.rowCount > 0) {
            return res.jsonp(EMPRESA.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnaEmpresa(req: Request, res: Response) {
        const { nombre } = req.params;
        const EMPRESA = await pool.query('SELECT * FROM cg_empresa WHERE nombre = $1', [nombre]);
        if (EMPRESA.rowCount > 0) {
            return res.jsonp(EMPRESA.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearEmpresa(req: Request, res: Response): Promise<void> {
        const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante } = req.body;
        await pool.query('INSERT INTO cg_empresa (nombre, ruc, direccion, telefono, correo, tipo_empresa, representante  ) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante]);
        res.jsonp({ message: 'La Empresa se registró con éxito' });
    }

    public async ActualizarEmpresa(req: Request, res: Response): Promise<void> {
        const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, id } = req.body;
        await pool.query('UPDATE cg_empresa SET nombre = $1, ruc = $2, direccion = $3, telefono = $4, correo = $5, tipo_empresa = $6, representante = $7 WHERE id = $8', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, id]);
        res.jsonp({ message: 'Empresa actualizada exitosamente' });
    }

}

export const EMPRESA_CONTROLADOR = new EmpresaControlador();

export default EMPRESA_CONTROLADOR;