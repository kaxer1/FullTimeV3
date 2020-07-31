import { Request, Response } from 'express';
import pool from '../../../database';
import excel from 'xlsx';
import fs from 'fs';

class DetalleCatalogoHorarioControlador {

    public async ListarDetalleHorarios(req: Request, res: Response) {
        const HORARIO = await pool.query('SELECT * FROM deta_horarios');
        if (HORARIO.rowCount > 0) {
            return res.jsonp(HORARIO.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearDetalleHorarios(req: Request, res: Response): Promise<void> {
        const { orden, hora, minu_espera, nocturno, id_horario, tipo_accion } = req.body;
        await pool.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minu_espera, nocturno, id_horario, tipo_accion]);
        res.jsonp({ message: 'Detalle de Horario se registró con éxito' });
    }

    public async ListarUnDetalleHorario(req: Request, res: Response): Promise<any> {
        const { id_horario } = req.params;
        const HORARIO = await pool.query('SELECT * FROM deta_horarios WHERE id_horario = $1', [id_horario]);
        if (HORARIO.rowCount > 0) {
            return res.jsonp(HORARIO.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearHorarioDetallePlantilla(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        plantilla.forEach(async (data: any) => {
            var { nombre_horario, orden, hora, nocturno, tipo_accion, minutos_espera } = data;
            console.log("datos", data)
            //console.log("datos", data);
            //console.log("almuerzo", min_almuerzo);
            var nombre = nombre_horario;
            console.log("datos", nombre);
            const idHorario = await pool.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
            var id_horario = idHorario.rows[0]['id'];
            console.log("horarios", idHorario.rows)
            if (minutos_espera != undefined) {
                //console.log("datos", data);
                //console.log("almuerzo", min_almuerzo);
                await pool.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
            } else {
                minutos_espera = '00:00';
                await pool.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minutos_espera, nocturno, id_horario, tipo_accion.split("-")[0]]);
            }
        });
        res.jsonp({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
    }

    public async ActualizarDetalleHorarios(req: Request, res: Response): Promise<void> {
        const { orden, hora, minu_espera, nocturno, id_horario, tipo_accion, id } = req.body;
        await pool.query('UPDATE deta_horarios SET orden = $1, hora = $2, minu_espera = $3, nocturno = $4, id_horario = $5, tipo_accion = $6 WHERE id = $7', [orden, hora, minu_espera, nocturno, id_horario, tipo_accion, id]);
        res.jsonp({ message: 'Detalle de Horario se registró con éxito' });
    }

    public async EliminarRegistros(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM deta_horarios WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

}

export const DETALLE_CATALOGO_HORARIO_CONTROLADOR = new DetalleCatalogoHorarioControlador();

export default DETALLE_CATALOGO_HORARIO_CONTROLADOR;