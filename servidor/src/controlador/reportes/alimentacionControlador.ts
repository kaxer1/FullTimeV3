import { Request, Response } from 'express';
import pool from '../../database';

class AlimentacionControlador {

    public async ListarPlanificadosConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT COUNT(ctc.nombre) AS cantidad, pc.id_comida, ctc.nombre, ' +
            'ctc.valor, (COUNT(ctc.nombre) * ctc.valor) AS total, tc.nombre AS tipo ' +
            'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
            'WHERE ctc.id = pc.id_comida AND tc.id = pc.tipo_comida AND pc.consumido = true AND ' +
            'pc.descripcion = \'Planificacion\' AND pc.extra = false AND pc.fecha BETWEEN $1 AND $2 ' +
            'GROUP BY pc.id_comida, ctc.nombre, ctc.valor, tc.nombre', [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarSolicitadosConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT COUNT(ctc.nombre) AS cantidad, pc.id_comida, ctc.nombre, ' +
            'ctc.valor, (COUNT(ctc.nombre) * ctc.valor) AS total, tc.nombre AS tipo ' +
            'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
            'WHERE ctc.id = pc.id_comida AND tc.id = pc.tipo_comida AND pc.consumido = true AND ' +
            'pc.descripcion = \'Solicitud\' AND pc.extra = false AND pc.fecha BETWEEN $1 AND $2 ' +
            'GROUP BY pc.id_comida, ctc.nombre, ctc.valor, tc.nombre', [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarExtrasConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT COUNT(ctc.nombre) AS cantidad, pc.id_comida, ctc.nombre, ' +
            'ctc.valor, (COUNT(ctc.nombre) * ctc.valor) AS total, tc.nombre AS tipo ' +
            'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
            'WHERE ctc.id = pc.id_comida AND tc.id = pc.tipo_comida AND pc.consumido = true AND pc.extra = true ' +
            'AND pc.fecha BETWEEN $1 AND $2 ' +
            'GROUP BY pc.id_comida, ctc.nombre, ctc.valor, tc.nombre', [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }


}

export const ALIMENTACION_CONTROLADOR = new AlimentacionControlador();

export default ALIMENTACION_CONTROLADOR;