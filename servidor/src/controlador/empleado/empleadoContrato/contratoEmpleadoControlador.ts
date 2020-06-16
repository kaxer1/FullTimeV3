import { Request, Response } from 'express';
import pool from '../../../database';

class ContratoEmpleadoControlador {

    public async ListarContratos(req: Request, res: Response) {
        const CONTRATOS = await pool.query('SELECT * FROM empl_contratos');
        if (CONTRATOS.rowCount > 0) {
            return res.jsonp(CONTRATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ObtenerUnContrato(req: Request, res: Response) {
        const id = req.params.id;
        const CONTRATOS = await pool.query('SELECT * FROM empl_contratos WHERE id = $1', [id]);
        if (CONTRATOS.rowCount > 0) {
            return res.jsonp(CONTRATOS.rows[0])
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros'});
        }
    }

    public async CrearContrato(req: Request, res: Response) {
        const { id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen } = req.body;
        await pool.query('INSERT INTO empl_contratos (id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen) VALUES ($1, $2, $3, $4, $5, $6)', [id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen]);
        res.jsonp({ message: 'Contrato guardado' });
    }


    public async EncontrarIdContrato(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO = await pool.query('SELECT ec.id FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (CONTRATO.rowCount > 0) {
            return res.jsonp(CONTRATO.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async EncontrarIdContratoActual(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO = await pool.query('SELECT MAX(ec.id) FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (CONTRATO.rowCount > 0) {
            if(CONTRATO.rows[0]['max'] != null){
              return res.jsonp(CONTRATO.rows)
            }
            else {
              res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
          }
          else {
            res.status(404).jsonp({ text: 'Registro no encontrado' });
          }
    }

    public async EncontrarContratoIdEmpleado(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO = await pool.query('SELECT ec.id, ec.id_empleado, ec.id_regimen, ec.fec_ingreso, ec.fec_salida, ec.vaca_controla, ec.asis_controla, cr.descripcion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id_empleado = $1 AND ec.id_regimen = cr.id', [id_empleado]);
        if (CONTRATO.rowCount > 0) {
            return res.jsonp(CONTRATO.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async EncontrarContratoEmpleadoRegimen(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO_EMPLEADO_REGIMEN = await pool.query('SELECT ec.fec_ingreso, fec_salida, cr.descripcion, dia_anio_vacacion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id_empleado = $1 and ec.id_regimen = cr.id', [id_empleado]);
        if (CONTRATO_EMPLEADO_REGIMEN.rowCount > 0) {
            return res.jsonp(CONTRATO_EMPLEADO_REGIMEN.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async EditarContrato(req: Request, res: Response): Promise <any> {
        const {id_empleado, id} = req.params;
        const { fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen } = req.body;
        await pool.query('UPDATE empl_contratos SET fec_ingreso = $1, fec_salida = $2, vaca_controla = $3, asis_controla = $4, id_regimen = $5  WHERE id_empleado = $6 AND id = $7', [fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, id_empleado, id]);
        res.jsonp({ message: 'Contrato del empleado actualizada exitosamente' });
    }
}

const CONTRATO_EMPLEADO_CONTROLADOR = new ContratoEmpleadoControlador();

export default CONTRATO_EMPLEADO_CONTROLADOR;