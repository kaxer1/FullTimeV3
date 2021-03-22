import { Request, Response } from 'express';
import pool from '../../database';

class AccionPersonalControlador {

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
        await pool.query('UPDATE tipo_accion_personla SET id_proceso = $1, descripcion = $2, base_legal = $3, ' +
            'tipo_permiso = $4, tipo_vacacion = $5, tipo_situacion_propuesta = $6 WHERE id = $7',
            [id_proceso, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta, id]);
        res.jsonp({ message: 'Registro exitoso' });
    }

    public async EliminarTipoAccionPersonal(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM tipo_accion_personal WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

}

export const ACCION_PERSONAL_CONTROLADOR = new AccionPersonalControlador();

export default ACCION_PERSONAL_CONTROLADOR;