import { Request, Response } from 'express';
import pool from '../../../database';
import excel from 'xlsx';
import fs from 'fs';

class PeriodoVacacionControlador {

    public async ListarPerVacaciones(req: Request, res: Response) {
        const VACACIONES = await pool.query('SELECT * FROM peri_vacaciones');
        if (VACACIONES.rowCount > 0) {
            return res.jsonp(VACACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPerVacaciones(req: Request, res: Response) {
        const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones } = req.body;
        await pool.query('INSERT INTO peri_vacaciones (id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones]);
        res.jsonp({ message: 'Período de Vacación guardado' });
    }

    public async EncontrarIdPerVacaciones(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const VACACIONES = await pool.query('SELECT pv.id, ce.id AS idContrato FROM peri_vacaciones AS pv, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND pv.id_empl_contrato = ce.id AND e.id = $1 ORDER BY pv.fec_final DESC', [id_empleado]);
        if (VACACIONES.rowCount > 0) {
            return res.jsonp(VACACIONES.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async EncontrarPerVacacionesPorIdContrato(req: Request, res: Response): Promise<any> {
        const { id_empl_contrato } = req.params;
        const PERIODO_VACACIONES = await pool.query('SELECT * FROM peri_vacaciones AS p WHERE p.id_empl_contrato = $1', [id_empl_contrato]);
        if (PERIODO_VACACIONES.rowCount > 0) {
            return res.jsonp(PERIODO_VACACIONES.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async ActualizarPeriodo(req: Request, res: Response): Promise<any> {
        const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones, id } = req.body;
        await pool.query('UPDATE peri_vacaciones SET id_empl_contrato = $1, descripcion = $2, dia_vacacion = $3 , dia_antiguedad = $4, estado = $5, fec_inicio = $6, fec_final = $7, dia_perdido = $8, horas_vacaciones = $9, min_vacaciones = $10 WHERE id = $11', [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones, id]);
        res.jsonp({ message: 'Registro Actualizado exitosamente' });
    }

    public async CargarPeriodoVacaciones(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        /** Periodo de vacaciones */
        plantilla.forEach(async (data: any) => {
            // Datos obtenidos de la plantilla
            var estado;
            var { nombre_empleado, apellido_empleado, cedula, descripcion, vacaciones_tomadas,
                fecha_inicia_periodo, fecha_fin_periodo, dias_vacacion, horas_vacacion, minutos_vacacion,
                dias_por_antiguedad, dias_perdidos } = data;
            // Obtener id del empleado mediante la cédula
            const datosEmpleado = await pool.query('SELECT id, nombre, apellido, codigo, estado FROM empleados WHERE cedula = $1', [cedula]);
            let id_empleado = datosEmpleado.rows[0]['id'];
            // Obtener el id del contrato actual del empleado indicado
            const CONTRATO = await pool.query('SELECT MAX(ec.id) FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
            let id_empl_contrato = CONTRATO.rows[0]['max'];
            // Cambiar el estado de vacaciones usadas a valores enteros
            if (vacaciones_tomadas === true) {
                estado = 1;
            }
            else {
                estado = 2;
            }
            // Registrar datos de periodo de vacación
            if (cedula != undefined) {
                await pool.query('INSERT INTO peri_vacaciones (id_empl_contrato, descripcion, dia_vacacion, ' +
                    'dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, ' +
                    'min_vacaciones ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id_empl_contrato,
                    descripcion, dias_vacacion, dias_por_antiguedad, estado, fecha_inicia_periodo,
                    fecha_fin_periodo, dias_perdidos, horas_vacacion, minutos_vacacion]);
            }
            else {
                console.log("Falta registrar cédula")
            }
        });

        res.jsonp({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
    }

}

const PERIODO_VACACION_CONTROLADOR = new PeriodoVacacionControlador();

export default PERIODO_VACACION_CONTROLADOR;