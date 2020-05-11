import { Request, Response } from 'express';
import pool from '../../../database';

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

}

export const EMPLEADO_HORARIOS_CONTROLADOR = new EmpleadoHorariosControlador();

export default EMPLEADO_HORARIOS_CONTROLADOR;