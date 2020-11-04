import { Request, Response } from 'express';
import pool from '../../database';

class DatosGeneralesControlador {

    public async ListarDatosEmpleadoAutoriza(req: Request, res: Response) {
        const { empleado_id } = req.params;
        const DATOS = await pool.query('SELECT * FROM datosCargoActual ($1)', [empleado_id]);
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

    public async ListarDatosActualesEmpleado(req: Request, res: Response) {
        const DATOS = await pool.query('SELECT e_datos.id, e_datos.cedula, e_datos.apellido, e_datos.nombre, ' +
            'e_datos.esta_civil, e_datos.genero, e_datos.correo, e_datos.fec_nacimiento, e_datos.estado, ' +
            'e_datos.mail_alternativo, e_datos.domicilio, e_datos.telefono, e_datos.id_nacionalidad, ' +
            'e_datos.imagen, e_datos.codigo, e_datos.id_contrato, e_datos.regimen, e_datos.id_cargo, c.cargo, ' +
            'c.id_departamento, d.nombre AS departamento, c.id_sucursal, s.nombre AS sucursal, s.id_empresa, ' +
            'empre.nombre AS empresa, s.id_ciudad, ciudades.descripcion AS ciudad ' +
            'FROM datos_actuales_empleado AS e_datos, empl_cargos AS c, cg_departamentos AS d, sucursales AS s, ' +
            'cg_empresa AS empre, ciudades ' +
            'WHERE c.id = e_datos.id_cargo AND d.id = c.id_departamento AND s.id = c.id_sucursal AND ' +
            's.id_empresa = empre.id AND ciudades.id = s.id_ciudad');
        if (DATOS.rowCount > 0) {
            return res.jsonp(DATOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'error' });
        }
    }

}

const DATOS_GENERALES_CONTROLADOR = new DatosGeneralesControlador();

export default DATOS_GENERALES_CONTROLADOR;


