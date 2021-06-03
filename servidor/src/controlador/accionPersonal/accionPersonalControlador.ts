import { Request, Response } from 'express';
import pool from '../../database';
import { ImagenBase64LogosEmpresas } from '../../libs/ImagenCodificacion';

class AccionPersonalControlador {

    /** TABLA TIPO_ACCION */
    public async ListarTipoAccion(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT * FROM tipo_accion');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearTipoAccion(req: Request, res: Response): Promise<void> {
        const { descripcion } = req.body;
        await pool.query('INSERT INTO tipo_accion (descripcion) VALUES($1)',
            [descripcion]);
        res.jsonp({ message: 'Registro guardado' });
    }

    public async EncontrarUltimoTipoAccion(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT MAX(id) AS id FROM tipo_accion');
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

    public async ListarUnCargoPropuestos(req: Request, res: Response) {
        const { id } = req.params;
        const ACCION = await pool.query('SELECT * FROM cargo_propuesto WHERE id = $1', [id]);
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

    public async ListarUnDecreto(req: Request, res: Response) {
        const { id } = req.params;
        const ACCION = await pool.query('SELECT * FROM decreto_acuerdo_resol WHERE id = $1', [id]);
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    /** TABLA TIPO_ACCION_PERSONAL */
    public async ListarTipoAccionPersonal(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT tap.id, tap.id_tipo, tap.descripcion, tap.base_legal, ' +
            'tap.tipo_permiso, tap.tipo_vacacion, tap.tipo_situacion_propuesta, ta.descripcion AS nombre ' +
            'FROM tipo_accion_personal AS tap, tipo_accion AS ta WHERE ta.id = tap.id_tipo');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarTipoAccionEdicion(req: Request, res: Response) {
        const { id } = req.params;
        const ACCION = await pool.query('SELECT * FROM tipo_accion_personal WHERE NOT id_tipo = $1', [id]);
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearTipoAccionPersonal(req: Request, res: Response): Promise<void> {
        const { id_tipo, descripcion, base_legal, tipo_permiso, tipo_vacacion,
            tipo_situacion_propuesta } = req.body;
        await pool.query('INSERT INTO tipo_accion_personal (id_tipo, descripcion, base_legal, tipo_permiso, ' +
            'tipo_vacacion, tipo_situacion_propuesta) VALUES($1, $2, $3, $4, $5, $6)',
            [id_tipo, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta]);
        res.jsonp({ message: 'Autorización se registró con éxito' });
    }

    public async EncontrarTipoAccionPersonalId(req: Request, res: Response) {
        const { id } = req.params;
        const ACCION = await pool.query('SELECT tap.id, tap.id_tipo, tap.descripcion, tap.base_legal, ' +
            'tap.tipo_permiso, tap.tipo_vacacion, tap.tipo_situacion_propuesta, ta.descripcion AS nombre ' +
            'FROM tipo_accion_personal AS tap, tipo_accion AS ta WHERE tap.id = $1 AND ta.id = tap.id_tipo',
            [id]);
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ActualizarTipoAccionPersonal(req: Request, res: Response): Promise<void> {
        const { id_tipo, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta, id } = req.body;
        await pool.query('UPDATE tipo_accion_personal SET id_tipo = $1, descripcion = $2, base_legal = $3, ' +
            'tipo_permiso = $4, tipo_vacacion = $5, tipo_situacion_propuesta = $6 WHERE id = $7',
            [id_tipo, descripcion, base_legal, tipo_permiso, tipo_vacacion, tipo_situacion_propuesta, id]);
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

    public async ActualizarPedidoAccionPersonal(req: Request, res: Response): Promise<void> {
        const { id_empleado, fec_creacion, fec_rige_desde, fec_rige_hasta, identi_accion_p, num_partida,
            decre_acue_resol, abrev_empl_uno, firma_empl_uno, abrev_empl_dos, firma_empl_dos, adicion_legal,
            tipo_accion, descrip_partida, cargo_propuesto, proceso_propuesto, num_partida_propuesta,
            salario_propuesto, id } = req.body;
        await pool.query('UPDATE accion_personal_empleado SET id_empleado = $1, fec_creacion = $2, ' +
            'fec_rige_desde = $3, fec_rige_hasta = $4, identi_accion_p = $5, num_partida = $6, ' +
            'decre_acue_resol = $7, abrev_empl_uno = $8, firma_empl_uno = $9, abrev_empl_dos = $10, ' +
            'firma_empl_dos = $11, adicion_legal = $12, tipo_accion = $13, descrip_partida = $14, ' +
            'cargo_propuesto = $15, proceso_propuesto = $16, num_partida_propuesta = $17, ' +
            'salario_propuesto = $18 WHERE id = $19',
            [id_empleado, fec_creacion, fec_rige_desde, fec_rige_hasta, identi_accion_p, num_partida,
                decre_acue_resol, abrev_empl_uno, firma_empl_uno, abrev_empl_dos, firma_empl_dos, adicion_legal,
                tipo_accion, descrip_partida, cargo_propuesto, proceso_propuesto, num_partida_propuesta,
                salario_propuesto, id]);
        res.jsonp({ message: 'Registro realizado con éxito' });
    }

    public async verLogoMinisterio(req: Request, res: Response): Promise<any> {
        const file_name = 'ministerio_trabajo.png';
        const codificado = await ImagenBase64LogosEmpresas(file_name);
        if (codificado === 0) {
            res.send({ imagen: 0 })
        } else {
            res.send({ imagen: codificado })
        }
    }

    /** CONSULTAS GENERACIÓN DE PDF */
    public async EncontrarDatosEmpleados(req: Request, res: Response) {
        const { id } = req.params;
        const EMPLEADO = await pool.query(' SELECT d.id, d.nombre, d.apellido, d.cedula, d.codigo, d.id_cargo, ' +
            'ec.sueldo, tc.cargo, cd.nombre AS departamento ' +
            'FROM datos_actuales_empleado AS d, empl_cargos AS ec, tipo_cargo AS tc, cg_departamentos AS cd ' +
            'WHERE d.id_cargo = ec.id AND ec.cargo = tc.id AND ec.id_departamento = cd.id AND d.id = $1',
            [id]);
        if (EMPLEADO.rowCount > 0) {
            return res.jsonp(EMPLEADO.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async EncontrarPedidoAccion(req: Request, res: Response) {
        const { id } = req.params;
        const ACCION = await pool.query('SELECT ap.id, ap.id_empleado, ap.fec_creacion, ap.fec_rige_desde, ' +
            'ap.fec_rige_hasta, ap.identi_accion_p, ap.num_partida, ap.decre_acue_resol, ap.abrev_empl_uno, ' +
            'ap.firma_empl_uno, ap.abrev_empl_dos, ap.firma_empl_dos, ap.adicion_legal, ap.tipo_accion, ' +
            'ap.descrip_partida, ap.cargo_propuesto, ap.proceso_propuesto, ap.num_partida_propuesta, ' +
            'ap.salario_propuesto, tap.base_legal, tap.id_tipo, ta.descripcion AS tipo ' +
            'FROM accion_personal_empleado AS ap, tipo_accion_personal AS tap, tipo_accion AS ta ' +
            'WHERE ap.tipo_accion = tap.id AND ap.id = $1 AND ta.id = tap.id_tipo',
            [id]);
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarPedidoAccion(req: Request, res: Response) {
        const ACCION = await pool.query('SELECT ap.id, ap.id_empleado, ap.fec_creacion, ap.fec_rige_desde, ' +
            'ap.fec_rige_hasta, ap.identi_accion_p, ap.num_partida, ap.decre_acue_resol, ap.abrev_empl_uno, ' +
            'ap.firma_empl_uno, ap.abrev_empl_dos, ap.firma_empl_dos, ap.adicion_legal, ap.tipo_accion, ' +
            'ap.descrip_partida, ap.cargo_propuesto, ap.proceso_propuesto, ap.num_partida_propuesta, ' +
            'ap.salario_propuesto, tap.base_legal, tap.id_tipo, e.codigo, e.cedula, e.nombre, e.apellido ' +
            'FROM accion_personal_empleado AS ap, tipo_accion_personal AS tap, empleados AS e ' +
            'WHERE ap.tipo_accion = tap.id AND e.id = ap.id_empleado');
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async EncontrarProcesosRecursivos(req: Request, res: Response) {
        const { id } = req.params;
        const ACCION = await pool.query('WITH RECURSIVE procesos AS ( ' +
            'SELECT id, nombre, proc_padre, 1 AS numero FROM cg_procesos WHERE id = $1 ' +
            'UNION ALL ' +
            'SELECT cg.id, cg.nombre, cg.proc_padre, procesos.numero + 1 AS numero FROM cg_procesos cg ' +
            'JOIN procesos ON cg.id = procesos.proc_padre ' +
            ') SELECT UPPER(nombre) AS nombre, numero FROM procesos ORDER BY numero DESC;',
            [id]);
        if (ACCION.rowCount > 0) {
            return res.jsonp(ACCION.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    /** CONSULTA RECURSIVA DE EMPLEADOS */
}

export const ACCION_PERSONAL_CONTROLADOR = new AccionPersonalControlador();

export default ACCION_PERSONAL_CONTROLADOR;