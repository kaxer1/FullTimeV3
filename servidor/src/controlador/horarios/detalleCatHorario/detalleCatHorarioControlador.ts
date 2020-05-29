import { Request, Response } from 'express';
import pool from '../../../database';

class DetalleCatalogoHorarioControlador {

    public async ListarDetalleHorarios(req: Request, res: Response) {
        const HORARIO = await pool.query('SELECT * FROM deta_horarios');
        if (HORARIO.rowCount > 0) {
            return res.json(HORARIO.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearDetalleHorarios(req: Request, res: Response): Promise<void> {
        const { orden, hora, minu_espera, nocturno, id_horario, tipo_accion } = req.body;
        await pool.query('INSERT INTO deta_horarios (orden, hora, minu_espera, nocturno, id_horario, tipo_accion) VALUES ($1, $2, $3, $4, $5, $6)', [orden, hora, minu_espera, nocturno, id_horario, tipo_accion]);
        res.json({ message: 'Detalle de Horario se registró con éxito'});
    }

    public async ListarUnDetalleHorario(req: Request, res: Response): Promise<any> {
        const { id_horario } = req.params;
        const HORARIO = await pool.query('SELECT * FROM deta_horarios WHERE id_horario = $1', [id_horario]);
        if (HORARIO.rowCount > 0) {
            return res.json(HORARIO.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

}

export const DETALLE_CATALOGO_HORARIO_CONTROLADOR = new DetalleCatalogoHorarioControlador();

export default DETALLE_CATALOGO_HORARIO_CONTROLADOR;