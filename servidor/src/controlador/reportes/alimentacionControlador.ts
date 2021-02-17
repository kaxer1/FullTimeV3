import { Request, Response } from 'express';
import pool from '../../database';

class AlimentacionControlador {

    public async ListarPlanificadosConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT tc.nombre AS comida_tipo, ctc.tipo_comida AS id_comida, ' +
            'ctc.nombre AS menu, dm.nombre AS plato, dm.valor, dm.observacion, COUNT(dm.nombre) AS cantidad, ' +
            '(COUNT(dm.nombre) * dm.valor) AS total ' +
            'FROM tipo_comida AS tc, cg_tipo_comidas AS ctc, detalle_menu AS dm, plan_comidas AS pc ' +
            'WHERE tc.id = ctc.tipo_comida AND dm.id_menu = ctc.id AND pc.id_comida = dm.id AND ' +
            'pc.descripcion = \'Planificacion\' AND pc.extra = false AND pc.consumido = true AND ' +
            'pc.fecha BETWEEN $1 AND $2 ' +
            'GROUP BY tc.nombre, ctc.tipo_comida, ctc.nombre, dm.nombre, dm.valor, dm.observacion',
            [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarSolicitadosConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT tc.nombre AS comida_tipo, ctc.tipo_comida AS id_comida, ' +
            'ctc.nombre AS menu, dm.nombre AS plato, dm.valor, dm.observacion, COUNT(dm.nombre) AS cantidad, ' +
            '(COUNT(dm.nombre) * dm.valor) AS total ' +
            'FROM tipo_comida AS tc, cg_tipo_comidas AS ctc, detalle_menu AS dm, plan_comidas AS pc ' +
            'WHERE tc.id = ctc.tipo_comida AND dm.id_menu = ctc.id AND pc.id_comida = dm.id AND ' +
            'pc.descripcion = \'Solicitud\' AND pc.extra = false AND pc.consumido = true AND ' +
            'pc.fecha BETWEEN $1 AND $2 ' +
            'GROUP BY tc.nombre, ctc.tipo_comida, ctc.nombre, dm.nombre, dm.valor, dm.observacion',
            [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarExtrasConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT tc.nombre AS comida_tipo, ctc.tipo_comida AS id_comida, ' +
            'ctc.nombre AS menu, dm.nombre AS plato, dm.valor, dm.observacion, COUNT(dm.nombre) AS cantidad, ' +
            '(COUNT(dm.nombre) * dm.valor) AS total ' +
            'FROM tipo_comida AS tc, cg_tipo_comidas AS ctc, detalle_menu AS dm, plan_comidas AS pc ' +
            'WHERE tc.id = ctc.tipo_comida AND dm.id_menu = ctc.id AND pc.id_comida = dm.id AND ' +
            'pc.extra = true AND pc.consumido = true AND pc.fecha BETWEEN $1 AND $2 ' +
            'GROUP BY tc.nombre, ctc.tipo_comida, ctc.nombre, dm.nombre, dm.valor, dm.observacion',
            [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async DetallarPlanificadosConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT e.nombre, e.apellido, e.cedula, e.codigo, ' +
            'tc.nombre AS comida_tipo, ctc.tipo_comida AS id_comida, ' +
            'ctc.nombre AS menu, dm.nombre AS plato, dm.valor, dm.observacion, COUNT(dm.nombre) AS cantidad, ' +
            '(COUNT(dm.nombre) * dm.valor) AS total ' +
            'FROM tipo_comida AS tc, cg_tipo_comidas AS ctc, detalle_menu AS dm, plan_comidas AS pc, empleados AS e ' +
            'WHERE tc.id = ctc.tipo_comida AND dm.id_menu = ctc.id AND pc.id_comida = dm.id AND ' +
            'pc.descripcion = \'Planificacion\' AND pc.extra = false AND pc.consumido = true AND ' +
            'pc.fecha BETWEEN $1 AND $2 AND e.id = pc.id_empleado ' +
            'GROUP BY tc.nombre, ctc.tipo_comida, ctc.nombre, dm.nombre, dm.valor, dm.observacion, e.nombre, ' +
            'e.apellido, e.cedula, e.codigo ORDER BY e.apellido ASC',
            [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async DetallarSolicitudConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT e.nombre, e.apellido, e.cedula, e.codigo, ' +
            'tc.nombre AS comida_tipo, ctc.tipo_comida AS id_comida, ' +
            'ctc.nombre AS menu, dm.nombre AS plato, dm.valor, dm.observacion, COUNT(dm.nombre) AS cantidad, ' +
            '(COUNT(dm.nombre) * dm.valor) AS total ' +
            'FROM tipo_comida AS tc, cg_tipo_comidas AS ctc, detalle_menu AS dm, plan_comidas AS pc, empleados AS e ' +
            'WHERE tc.id = ctc.tipo_comida AND dm.id_menu = ctc.id AND pc.id_comida = dm.id AND ' +
            'pc.descripcion = \'Solicitud\' AND pc.extra = false AND pc.consumido = true AND ' +
            'pc.fecha BETWEEN $1 AND $2 AND e.id = pc.id_empleado ' +
            'GROUP BY tc.nombre, ctc.tipo_comida, ctc.nombre, dm.nombre, dm.valor, dm.observacion, e.nombre, ' +
            'e.apellido, e.cedula, e.codigo ORDER BY e.apellido ASC',
            [fec_inicio, fec_final]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async DetallarExtrasConsumidos(req: Request, res: Response) {
        const { fec_inicio, fec_final } = req.body;
        const DATOS = await pool.query('SELECT e.nombre, e.apellido, e.cedula, e.codigo, ' +
            'tc.nombre AS comida_tipo, ctc.tipo_comida AS id_comida, ' +
            'ctc.nombre AS menu, dm.nombre AS plato, dm.valor, dm.observacion, COUNT(dm.nombre) AS cantidad, ' +
            '(COUNT(dm.nombre) * dm.valor) AS total ' +
            'FROM tipo_comida AS tc, cg_tipo_comidas AS ctc, detalle_menu AS dm, plan_comidas AS pc, empleados AS e ' +
            'WHERE tc.id = ctc.tipo_comida AND dm.id_menu = ctc.id AND pc.id_comida = dm.id AND ' +
            'pc.extra = true AND pc.consumido = true AND pc.fecha BETWEEN $1 AND $2 AND e.id = pc.id_empleado ' +
            'GROUP BY tc.nombre, ctc.tipo_comida, ctc.nombre, dm.nombre, dm.valor, dm.observacion, e.nombre, ' +
            'e.apellido, e.cedula, e.codigo ORDER BY e.apellido ASC',
            [fec_inicio, fec_final]);
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