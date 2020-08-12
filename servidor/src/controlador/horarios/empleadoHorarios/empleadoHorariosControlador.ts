import { Request, Response } from 'express';
import pool from '../../../database';
import excel from 'xlsx';
import fs from 'fs';

class EmpleadoHorariosControlador {

    public async ListarEmpleadoHorarios(req: Request, res: Response) {
        const HORARIOS = await pool.query('SELECT * FROM empl_horarios');
        if (HORARIOS.rowCount > 0) {
            return res.jsonp(HORARIOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearEmpleadoHorarios(req: Request, res: Response): Promise<void> {
        const { id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado } = req.body;
        await pool.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado]);
        res.jsonp({ message: 'El horario del empleado se registró con éxito' });
    }

    public async ListarHorarioCargo(req: Request, res: Response) {
        const { id_empl_cargo } = req.params;
        const HORARIOS = await pool.query('SELECT * FROM VistaHorarioEmpleado WHERE id_empl_cargo = $1', [id_empl_cargo]);
        if (HORARIOS.rowCount > 0) {
            return res.jsonp(HORARIOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearHorarioEmpleadoPlantilla(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        plantilla.forEach(async (data: any) => {
            const { id } = req.params;
            var { fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
            const id_cargo = await pool.query('SELECT MAX(ec.id) FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id]);
            var id_empl_cargo = id_cargo.rows[0]['max'];;
            var nombre = nombre_horario;
            const idHorario = await pool.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
            var id_horarios = idHorario.rows[0]['id'];
            var id_hora = 1;
            await pool.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado.split("-")[0]]);
            console.log("carga exitosa");
        });
        res.jsonp({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
    }

    public async CargarMultiplesHorariosEmpleadosPlantilla(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        plantilla.forEach(async (data: any) => {
            var { cedula, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
            const id_cargo = await pool.query('SELECT MAX(ecargo.id) FROM empl_cargos AS ecargo, empl_contratos AS econtrato, empleados AS e WHERE econtrato.id_empleado = e.id AND ecargo.id_empl_contrato = econtrato.id AND e.cedula = $1', [cedula]);
            var id_empl_cargo = id_cargo.rows[0]['max'];;
            var nombre = nombre_horario;
            const idHorario = await pool.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
            var id_horarios = idHorario.rows[0]['id'];
            var id_hora = 1;
            await pool.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado.split("-")[0]]);
            console.log("carga exitosa");
        });
        res.jsonp({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
    }

    public async ObtenerNumeroHoras(req: Request, res: Response): Promise<any> {
        const { id_emple, fecha } = req.body;
        const HORAS = await pool.query('SELECT * FROM VistaNumeroHoras WHERE id_emple = $1 AND $2 BETWEEN fec_inicio AND fec_final', [id_emple, fecha]);
        if (HORAS.rowCount > 0) {
            return res.jsonp(HORAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'Registros no encontrados' });
        }
    }

    public async ActualizarEmpleadoHorarios(req: Request, res: Response): Promise<void> {
        const { id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, id } = req.body;
        await pool.query('UPDATE empl_horarios SET id_empl_cargo = $1, id_hora = $2, fec_inicio = $3, fec_final = $4, lunes = $5, martes = $6, miercoles = $7, jueves = $8, viernes = $9, sabado = $10, domingo = $11, id_horarios = $12, estado = $13 WHERE id = $14', [id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, id]);
        res.jsonp({ message: 'El horario del empleado se registró con éxito' });
    }

    public async EliminarRegistros(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM empl_horarios WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

}

export const EMPLEADO_HORARIOS_CONTROLADOR = new EmpleadoHorariosControlador();

export default EMPLEADO_HORARIOS_CONTROLADOR;

