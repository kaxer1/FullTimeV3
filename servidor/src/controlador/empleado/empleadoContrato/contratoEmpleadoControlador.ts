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


    public async EncontrarIdContrato(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO = await pool.query('SELECT ec.id FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (CONTRATO.rowCount > 0) {
            return res.json(CONTRATO.rows)
        }
        res.status(404).json({ text: 'Registro no encontrado' });
    }

    public async EncontrarContratoEmpleadoRegimen(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO_EMPLEADO_REGIMEN = await pool.query('SELECT ec.fec_ingreso, fec_salida, cr.descripcion, dia_anio_vacacion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id_empleado = $1 and ec.id_regimen = cr.id', [id_empleado]);
        if (CONTRATO_EMPLEADO_REGIMEN.rowCount > 0) {
            return res.json(CONTRATO_EMPLEADO_REGIMEN.rows)
        }
        res.status(404).json({ text: 'Registro no encontrado' });
    }

}

const CONTRATO_EMPLEADO_CONTROLADOR = new ContratoEmpleadoControlador();

export default CONTRATO_EMPLEADO_CONTROLADOR;