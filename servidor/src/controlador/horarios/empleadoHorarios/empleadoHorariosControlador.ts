import { Request, Response } from 'express';
import pool from '../../../database';
import excel from 'xlsx';
import fs from 'fs';

class EmpleadoHorariosControlador {

    public async ListarEmpleadoHorarios(req: Request, res: Response) {
        const HORARIOS = await pool.query('SELECT * FROM empl_horarios');
        if (HORARIOS.rowCount > 0) {
            return res.json(HORARIOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearEmpleadoHorarios(req: Request, res: Response): Promise<void> {
        const { id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado } = req.body;
        await pool.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado]);
        res.json({ message: 'El horario del empleado se registró con éxito' });
    }

    public async ListarHorarioCargo(req: Request, res: Response) {
        const { id_empl_cargo } = req.params;
        const HORARIOS = await pool.query('SELECT * FROM VistaHorarioEmpleado WHERE id_empl_cargo = $1', [id_empl_cargo]);
        if (HORARIOS.rowCount > 0) {
            return res.json(HORARIOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
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
            var { fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nom_horario, estado } = data;
            const id_cargo = await pool.query('SELECT MAX(ec.id) FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id]);
            var id_empl_cargo = id_cargo.rows[0]['max'];;
            var nombre = nom_horario;
            const idHorario = await pool.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
            var id_horarios = idHorario.rows[0]['id'];
            var id_hora = 1;
            await pool.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado.split("-")[0]]);
            console.log("carga exitosa");
        });
        res.json({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
    }

}

export const EMPLEADO_HORARIOS_CONTROLADOR = new EmpleadoHorariosControlador();

export default EMPLEADO_HORARIOS_CONTROLADOR;

