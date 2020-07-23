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
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearContrato(req: Request, res: Response) {
        const { id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre } = req.body;
        await pool.query('INSERT INTO empl_contratos (id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre]);
        const ultimo = await pool.query('SELECT MAX(id) AS id FROM empl_contratos');

        res.jsonp({ message: 'El contrato ha sido registrado', id: ultimo.rows[0].id });
    }


    public async EncontrarIdContrato(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO = await pool.query('SELECT ec.id FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (CONTRATO.rowCount > 0) {
            return res.jsonp(CONTRATO.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'Registro no encontrado' });
        }
        
    }

    public async EncontrarIdContratoActual(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO = await pool.query('SELECT MAX(ec.id) FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (CONTRATO.rowCount > 0) {
            if (CONTRATO.rows[0]['max'] != null) {
                return res.jsonp(CONTRATO.rows)
            }
            else {
                return res.status(404).jsonp({ text: 'Registro no encontrado' });
            }
        }
        else {
            return res.status(404).jsonp({ text: 'Registro no encontrado' });
        }
    }

    public async EncontrarDatosUltimoContrato(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const CONTRATO = await pool.query('SELECT ec.id, ec.id_empleado, ec.id_regimen, ec.fec_ingreso, ec.fec_salida, ec.vaca_controla, ec.asis_controla, ec.doc_nombre, ec.documento, cr.descripcion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id = $1 AND ec.id_regimen = cr.id', [id]);
        if (CONTRATO.rowCount > 0) {
            return res.jsonp(CONTRATO.rows)
        }
        else {
           return res.status(404).jsonp({ text: 'Registro no encontrado' });
        }
        
    }

    public async EncontrarContratoEmpleadoRegimen(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const CONTRATO_EMPLEADO_REGIMEN = await pool.query('SELECT ec.id, ec.fec_ingreso, fec_salida, cr.descripcion, dia_anio_vacacion FROM empl_contratos AS ec, cg_regimenes AS cr WHERE ec.id_empleado = $1 and ec.id_regimen = cr.id ORDER BY ec.id ASC', [id_empleado]);
        if (CONTRATO_EMPLEADO_REGIMEN.rowCount > 0) {
            return res.jsonp(CONTRATO_EMPLEADO_REGIMEN.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'Registro no encontrado' });
        }
        
    }

    public async EditarContrato(req: Request, res: Response): Promise<any> {
        const { id_empleado, id } = req.params;
        const { fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre } = req.body;
        await pool.query('UPDATE empl_contratos SET fec_ingreso = $1, fec_salida = $2, vaca_controla = $3, asis_controla = $4, id_regimen = $5, doc_nombre = $6  WHERE id_empleado = $7 AND id = $8', [fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen, doc_nombre, id_empleado, id]);
        res.jsonp({ message: 'Contrato del empleado actualizada exitosamente' });
    }

    public async GuardarDocumentoContrato(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let doc = list.uploads[0].path.split("\\")[1];
        let id = req.params.id;
        await pool.query('UPDATE empl_contratos SET documento = $2 WHERE id = $1', [id, doc]);
        res.jsonp({ message: 'Documento Actualizado' });
    }

    public async ObtenerDocumento(req: Request, res: Response): Promise<any> {
        const docs = req.params.docs;
        let filePath = `servidor\\contratos\\${docs}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    public async EditarDocumento(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const { documento } = req.body;
        await pool.query('UPDATE empl_contratos SET documento = $1 WHERE id = $2', [documento, id]);
    
        res.jsonp({ message: 'Contrato Actualizado' });
      }
}

const CONTRATO_EMPLEADO_CONTROLADOR = new ContratoEmpleadoControlador();

export default CONTRATO_EMPLEADO_CONTROLADOR;