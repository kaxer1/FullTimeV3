import { Request, Response } from 'express';
import pool from '../../../database';

class ContratoEmpleadoControlador {

    public async ListarContratos(req: Request, res: Response) {
        const CONTRATOS = await pool.query('SELECT * FROM empl_contratos');
        if (CONTRATOS.rowCount > 0) {
            return res.json(CONTRATOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearContrato(req: Request, res: Response) {
        const { id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen } = req.body;
        await pool.query('INSERT INTO empl_contratos (id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen) VALUES ($1, $2, $3, $4, $5, $6)', [id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen]);
        res.json({ message: 'Contrato guardado' });
    }

}

const CONTRATO_EMPLEADO_CONTROLADOR = new ContratoEmpleadoControlador();

export default CONTRATO_EMPLEADO_CONTROLADOR;