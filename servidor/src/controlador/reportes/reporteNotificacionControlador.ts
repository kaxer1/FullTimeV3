import { Request, Response } from 'express';
import pool from '../../database';

class NotificacionesControlador {

    public async ListarPermisosEnviados(req: Request, res: Response) {
        const { envia } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.id_receives_depa, rn.estado, rn.create_at, rn.id_permiso, e.nombre, e.apellido, e.cedula, ' +
            'ctp.descripcion AS permiso, p.fec_inicio, p.fec_final ' +
            'FROM realtime_noti AS rn, empleados AS e, permisos AS p, cg_tipo_permisos AS ctp ' +
            'WHERE id_permiso IS NOT null AND e.id = rn.id_receives_empl AND rn.id_send_empl = $1 AND ' +
            'p.id = rn.id_permiso AND p.id_tipo_permiso = ctp.id ORDER BY rn.id DESC',
            [envia]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarPermisosRecibidos(req: Request, res: Response) {
        const { recibe } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.id_receives_depa, rn.estado, rn.create_at, rn.id_permiso, e.nombre, e.apellido, e.cedula, ' +
            'ctp.descripcion AS permiso, p.fec_inicio, p.fec_final ' +
            'FROM realtime_noti AS rn, empleados AS e, permisos AS p, cg_tipo_permisos AS ctp ' +
            'WHERE id_permiso IS NOT null AND e.id = rn.id_send_empl AND rn.id_receives_empl = $1 AND ' +
            'p.id = rn.id_permiso AND p.id_tipo_permiso = ctp.id ORDER BY rn.id DESC',
            [recibe]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarSolicitudHoraExtraEnviadas(req: Request, res: Response) {
        const { envia } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.id_receives_depa, rn.estado, rn.create_at, rn.id_hora_extra, e.nombre, e.apellido, e.cedula, ' +
            'h.fec_inicio, h.fec_final, h.descripcion, h.num_hora, h.tiempo_autorizado ' +
            'FROM realtime_noti AS rn, empleados AS e, hora_extr_pedidos AS h ' +
            'WHERE rn.id_hora_extra IS NOT null AND e.id = rn.id_receives_empl AND rn.id_send_empl = $1 AND ' +
            'h.id = rn.id_hora_extra ORDER BY rn.id DESC',
            [envia]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }


    public async ListarSolicitudHoraExtraRecibidas(req: Request, res: Response) {
        const { recibe } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.id_receives_depa, rn.estado, rn.create_at, rn.id_hora_extra, e.nombre, e.apellido, e.cedula, ' +
            'h.fec_inicio, h.fec_final, h.descripcion, h.num_hora, h.tiempo_autorizado ' +
            'FROM realtime_noti AS rn, empleados AS e, hora_extr_pedidos AS h ' +
            'WHERE rn.id_hora_extra IS NOT null AND e.id = rn.id_send_empl AND rn.id_receives_empl = $1 AND ' +
            'h.id = rn.id_hora_extra ORDER BY rn.id DESC',
            [recibe]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarVacacionesEnviadas(req: Request, res: Response) {
        const { envia } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.id_receives_depa, rn.estado, rn.create_at, rn.id_vacaciones, e.nombre, e.apellido, e.cedula, ' +
            'v.fec_inicio, v.fec_final, v.fec_ingreso ' +
            'FROM realtime_noti AS rn, empleados AS e, vacaciones AS v ' +
            'WHERE rn.id_vacaciones IS NOT null AND e.id = rn.id_receives_empl AND rn.id_send_empl = $1 AND ' +
            'v.id = rn.id_vacaciones ORDER BY rn.id DESC',
            [envia]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarVacacionesRecibidas(req: Request, res: Response) {
        const { recibe } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.id_receives_depa, rn.estado, rn.create_at, rn.id_vacaciones, e.nombre, e.apellido, e.cedula, ' +
            'v.fec_inicio, v.fec_final, v.fec_ingreso ' +
            'FROM realtime_noti AS rn, empleados AS e, vacaciones AS v ' +
            'WHERE rn.id_vacaciones IS NOT null AND e.id = rn.id_send_empl AND rn.id_receives_empl = $1 AND ' +
            'v.id = rn.id_vacaciones ORDER BY rn.id DESC',
            [recibe]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarPlanificaComidaEnviadas(req: Request, res: Response) {
        const { envia } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.create_at, e.nombre, e.apellido, e.cedula, ' +
            'rn.descripcion ' +
            'FROM realtime_timbres AS rn, empleados AS e ' +
            'WHERE e.id = rn.id_receives_empl AND rn.id_send_empl = $1 AND rn.descripcion like \'Alimentación Planificada%\' ' +
            'ORDER BY rn.id DESC',
            [envia]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarPlanificacionesEliminadas(req: Request, res: Response) {
        const { envia } = req.params;
        const DATOS = await pool.query('SELECT rn.id, rn.id_send_empl, rn.id_receives_empl, ' +
            'rn.create_at, e.nombre, e.apellido, e.cedula, ' +
            'rn.descripcion ' +
            'FROM realtime_timbres AS rn, empleados AS e ' +
            'WHERE e.id = rn.id_receives_empl AND rn.id_send_empl = $1 AND rn.descripcion like \'Planificación de Alimentación Eliminada.\' ' +
            'ORDER BY rn.id DESC',
            [envia]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }
}

export const NOTIFICACIONES_CONTROLADOR = new NotificacionesControlador();

export default NOTIFICACIONES_CONTROLADOR;