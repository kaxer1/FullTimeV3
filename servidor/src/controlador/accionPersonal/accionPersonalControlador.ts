import { Request, Response } from 'express';
import pool from '../../database';

class AccionPersonalControlador {

    /** TABLA PROCESO_PROPUESTO */
    public async ListarProcesosPropuestos(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT * FROM proceso_propuesto');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearProcesoPropuesto(req: Request, res: Response): Promise<void> {
        const { descripcion } = req.body;
        await pool.query('INSERT INTO proceso_propuesto (descripcion) VALUES($1)',
            [descripcion]);
        res.jsonp({ message: 'Registro guardado' });
    }

    public async EncontrarUltimoProceso(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT MAX(id) AS id FROM proceso_propuesto');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    /** TABLA CARGO_PROPUESTO */
    public async ListarCargoPropuestos(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT * FROM cargo_propuesto');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearCargoPropuesto(req: Request, res: Response): Promise<void> {
        const { descripcion } = req.body;
        await pool.query('INSERT INTO cargo_propuesto (descripcion) VALUES($1)',
            [descripcion]);
        res.jsonp({ message: 'Registro guardado' });
    }

    public async EncontrarUltimoCargoP(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT MAX(id) AS id FROM cargo_propuesto');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    /** TABLA DECRETO_ACUERDO_RESOL */
    public async ListarDecretos(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT * FROM decreto_acuerdo_resol');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearDecreto(req: Request, res: Response): Promise<void> {
        const { descripcion } = req.body;
        await pool.query('INSERT INTO decreto_acuerdo_resol (descripcion) VALUES($1)',
            [descripcion]);
        res.jsonp({ message: 'Registro guardado' });
    }

    public async EncontrarUltimoDecreto(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT MAX(id) AS id FROM decreto_acuerdo_resol');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    /** TABLA TIPO_ACCION_PERSONAL */
    public async ListarTipoAccionPersonal(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT tap.id, tap.id_proceso, tap.descripcion, tap.base_legal, ' +
            'tap.tipo_permiso, tap.tipo_vacacion, tap.tipo_situacion_propuesta, cp.nombre ' +
            'FROM tipo_accion_personal AS tap, cg_procesos AS cp WHERE cp.id = tap.id_proceso');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearTipoAccionPersonal(req: Request, res: Response): Promise<void> {
        const { id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion,
            tipo_situacion_propuesta } = req.body;
        await pool.query('INSERT INTO tipo_accion_personal (id_proceso, descripcion, base_legal, tipo_permiso, ' +
            'tipo_vacacion, tipo_situacion_propuesta) VALUES($1, $2, $3, $4, $5, $6)',
            [id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta]);
        res.jsonp({ message: 'Autorización se registró con éxito' });
    }

    public async EncontrarTipoAccionPersonalId(req: Request, res: Response) {
        const { id } = req.params;
        const ACCION = await pool.query('SELECT tap.id_proceso, tap.descripcion, tap.base_legal, ' +
            'tap.tipo_permiso, tap.tipo_vacacion, tap.tipo_situacion_propuesta, cp.nombre AS proceso ' +
            'FROM tipo_accion_personal AS tap, cg_procesos AS cp WHERE tap.id = $1 AND cp.id = tap.id_proceso',
            [id]);
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ActualizarTipoAccionPersonal(req: Request, res: Response): Promise<void> {
        const { id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta, id } = req.body;
        await pool.query('UPDATE tipo_accion_personal SET id_proceso = $1, descripcion = $2, base_legal = $3, ' +
            'tipo_permiso = $4, tipo_vacacion = $5, tipo_situacion_propuesta = $6 WHERE id = $7',
            [id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta, id]);
        res.jsonp({ message: 'Registro exitoso' });
    }

    public async EliminarTipoAccionPersonal(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM tipo_accion_personal WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

    /** TABLA ACCION_PERSONAL_EMPLEADO */

    public async CrearPedidoAccionPersonal(req: Request, res: Response): Promise<void> {
        const { id_empleado, fec_creacion, fec_rige_desde, fec_rige_hasta, identi_accion_p, num_partida,
            decre_acue_resol, abrev_empl_uno, firma_empl_uno, abrev_empl_dos, firma_empl_dos, adicion_legal,
            tipo_accion, descrip_partida, cargo_propuesto, proceso_propuesto, num_partida_propuesta,
            salario_propuesto } = req.body;
        await pool.query('INSERT INTO accion_personal_empleado (id_empleado, fec_creacion, fec_rige_desde, ' +
            'fec_rige_hasta, identi_accion_p, num_partida, decre_acue_resol, abrev_empl_uno, firma_empl_uno, ' +
            'abrev_empl_dos, firma_empl_dos, adicion_legal, tipo_accion, descrip_partida, cargo_propuesto, ' +
            'proceso_propuesto, num_partida_propuesta, salario_propuesto) ' +
            'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)',
            [id_empleado, fec_creacion, fec_rige_desde, fec_rige_hasta, identi_accion_p, num_partida,
                decre_acue_resol, abrev_empl_uno, firma_empl_uno, abrev_empl_dos, firma_empl_dos, adicion_legal,
                tipo_accion, descrip_partida, cargo_propuesto, proceso_propuesto, num_partida_propuesta,
                salario_propuesto]);
        res.jsonp({ message: 'Registro realizado con éxito' });
    }

}

export const ACCION_PERSONAL_CONTROLADOR = new AccionPersonalControlador();

export default ACCION_PERSONAL_CONTROLADOR;