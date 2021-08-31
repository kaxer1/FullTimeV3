import { Request, Response } from 'express';
import pool from '../../../database';

class VacunasControlador {

    // LISTAR TODOS LOS REGISTROS DE VACUNACIÓN
    public async ListarRegistro(req: Request, res: Response) {
        const VACUNA = await pool.query('SELECT ev.id, ev.id_empleado, ev.id_tipo_vacuna, ' +
            'ev.carnet, tv.nombre AS vacuna, ev.nom_carnet, ev.dosis_1, ev.dosis_2, ' +
            'ev.dosis_3, ev.fecha_1, ev.fecha_2, ev.fecha_3 ' +
            'FROM empl_vacuna AS ev, tipo_vacuna AS tv WHERE ev.id_tipo_vacuna = tv.id ORDER BY ev.id ASC');
        if (VACUNA.rowCount > 0) {
            return res.jsonp(VACUNA.rows)
        }
        else {
            res.status(404).jsonp({ text: 'Registro no encontrado.' });
        }
    }

    // LISTAR REGISTRO DE VACUNACIÓN DEL EMPLEADO POR SU ID
    public async ListarUnRegistro(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const VACUNA = await pool.query('SELECT ev.id, ev.id_empleado, ev.id_tipo_vacuna, ' +
            'ev.carnet, tv.nombre AS vacuna, ev.nom_carnet, ev.dosis_1, ev.dosis_2, ' +
            'ev.dosis_3, ev.fecha_1, ev.fecha_2, ev.fecha_3 ' +
            'FROM empl_vacuna AS ev, tipo_vacuna AS tv WHERE ev.id_tipo_vacuna = tv.id AND ev.id_empleado = $1',
            [id_empleado]);
        if (VACUNA.rowCount > 0) {
            return res.jsonp(VACUNA.rows)
        }
        else {
            res.status(404).jsonp({ text: 'Registro no encontrado.' });
        }
    }

    // CREAR REGISTRO DE VACUNACIÓN
    public async CrearRegistro(req: Request, res: Response): Promise<void> {
        const { id_empleado, id_tipo_vacuna, dosis_1, dosis_2, dosis_3, fecha_1, fecha_2, fecha_3, nom_carnet } = req.body;
        await pool.query('INSERT INTO empl_vacuna ( id_empleado, id_tipo_vacuna, dosis_1, dosis_2, ' +
            'dosis_3, fecha_1, fecha_2, fecha_3, nom_carnet) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [id_empleado, id_tipo_vacuna, dosis_1, dosis_2, dosis_3, fecha_1, fecha_2, fecha_3, nom_carnet]);
        res.jsonp({ message: 'Registro guardado.' });
    }

    // ACTUALIZAR REGISTRO DE VACUNACIÓN
    public async ActualizarRegistro(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { id_tipo_vacuna, dosis_1, dosis_2, dosis_3, fecha_1, fecha_2, fecha_3, nom_carnet } = req.body;
        await pool.query('UPDATE empl_vacuna SET id_tipo_vacuna = $1, dosis_1 = $2, dosis_2 = $3, dosis_3 = $4, ' +
            'fecha_1 = $5, fecha_2 = $6, fecha_3 = $7, nom_carnet = $8 WHERE id = $9',
            [id_tipo_vacuna, dosis_1, dosis_2, dosis_3, fecha_1, fecha_2, fecha_3, nom_carnet, id]);
        res.jsonp({ message: 'Registro actualizado.' });
    }

    // ELIMINAR REGISTRO DE VACUNACIÓN
    public async EliminarRegistro(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM empl_vacuna WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado.' });
    }

    // REGISTRO DE CERTIFICADO O CARNET DE VACUNACIÓN
    public async GuardarDocumento(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let documento = list.uploads[0].path.split("\\")[1];
        let id = req.params.id;
        await pool.query('UPDATE empl_vacuna SET carnet = $2 WHERE id_empleado = $1', [id, documento]);
        res.jsonp({ message: 'Registro guardado.' });
    }

    // OBTENER CERTIFICADO DE VACUNACIÓN
    public async ObtenerDocumento(req: Request, res: Response): Promise<any> {
        const docs = req.params.docs;
        let filePath = `servidor\\carnetVacuna\\${docs}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    /** ****************************************************************************************  *
     *                                      TIPO DE VACUNA                                        *
     *  ***************************************************************************************** */

    // LISTAR REGISTRO TIPO DE VACUNA
    public async ListarTipoVacuna(req: Request, res: Response) {
        const VACUNA = await pool.query('SELECT * FROM tipo_vacuna');
        if (VACUNA.rowCount > 0) {
            return res.jsonp(VACUNA.rows)
        }
        else {
            res.status(404).jsonp({ text: 'Registro no encontrado.' });
        }
    }

    // CREAR REGISTRO DE TIPO DE VACUNA
    public async CrearTipoVacuna(req: Request, res: Response): Promise<void> {
        const { nombre } = req.body;
        await pool.query('INSERT INTO tipo_vacuna (nombre) VALUES ($1)', [nombre]);
        res.jsonp({ message: 'Registro guardado.' });
    }

    // OBTENER EL ULTIMO REGISTRO DE TIPO DE VACUNA REALIZADO
    public async ObtenerUltimoId(req: Request, res: Response) {
        const VACUNA = await pool.query('SELECT MAX(id) FROM tipo_vacuna');
        if (VACUNA.rowCount > 0) {
            return res.jsonp(VACUNA.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros.' });
        }
    }

}

export const VACUNAS_CONTROLADOR = new VacunasControlador();

export default VACUNAS_CONTROLADOR;