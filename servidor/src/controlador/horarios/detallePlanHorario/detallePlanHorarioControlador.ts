import { Request, Response } from 'express';
import pool from '../../../database';
import excel from 'xlsx';
import fs from 'fs';

class DetallePlanHorarioControlador {

    public async ListarDetallePlanHorario(req: Request, res: Response) {
        const HORARIO = await pool.query('SELECT * FROM plan_hora_detalles');
        if (HORARIO.rowCount > 0) {
            return res.jsonp(HORARIO.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearDetallePlanHorario(req: Request, res: Response): Promise<void> {
        const { fecha, id_plan_horario, tipo_dia, id_cg_horarios } = req.body;
        await pool.query('INSERT INTO plan_hora_detalles ( fecha, id_plan_horario, tipo_dia, id_cg_horarios ) VALUES ($1, $2, $3, $4)', [fecha, id_plan_horario, tipo_dia, id_cg_horarios]);
        res.jsonp({ message: 'Detalle Plan Horario Registrado' });
    }

    public async EncontrarPlanHoraDetallesPorIdPlanHorario(req: Request, res: Response): Promise<any> {
        const { id_plan_horario } = req.params;
        const HORARIO_CARGO = await pool.query('SELECT p.id, p.fecha, p.id_plan_horario, p.tipo_dia, h.id AS id_horario, h.nombre AS horarios FROM plan_hora_detalles AS p, cg_horarios AS h WHERE p.id_plan_horario = $1 AND p.id_cg_horarios = h.id ', [id_plan_horario]);
        if (HORARIO_CARGO.rowCount > 0) {
            return res.jsonp(HORARIO_CARGO.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async CrearDetallePlanificacionPlantilla(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        plantilla.forEach(async (data: any) => {
            const { id_plan_horario } = req.params;
            const { fecha_inicio_actividades, tipo_dia, nombre_horario } = data;
            const idHorario = await pool.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre_horario]);
            if (fecha_inicio_actividades != undefined) {
                await pool.query('INSERT INTO plan_hora_detalles (fecha, id_plan_horario, tipo_dia, id_cg_horarios) VALUES ($1, $2, $3, $4)', [fecha_inicio_actividades, id_plan_horario, tipo_dia.split(" ")[0], idHorario.rows[0]['id']]);
            }
        });
        res.jsonp({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
    }

    public async ActualizarDetallePlanHorario(req: Request, res: Response): Promise<void> {
        const { fecha, id_plan_horario, tipo_dia, id_cg_horarios, id } = req.body;
        await pool.query('UPDATE plan_hora_detalles SET fecha = $1, id_plan_horario = $2, tipo_dia = $3, id_cg_horarios = $4 WHERE id = $5', [fecha, id_plan_horario, tipo_dia, id_cg_horarios, id]);
        res.jsonp({ message: 'Detalle Plan Horario Actualizado' });
    }

    public async EliminarRegistros(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM plan_hora_detalles WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

}

export const DETALLE_PLAN_HORARIO_CONTROLADOR = new DetallePlanHorarioControlador();

export default DETALLE_PLAN_HORARIO_CONTROLADOR;