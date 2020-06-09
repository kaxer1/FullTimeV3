import { Request, Response } from 'express';
import pool from '../../database';

class PermisosControlador {

    public async ListarPermisos(req: Request, res: Response) {
        const PERMISOS = await pool.query('SELECT * FROM permisos');
        if (PERMISOS.rowCount > 0) {
            return res.jsonp(PERMISOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarEstadosPermisos(req: Request, res: Response) {
        const PERMISOS = await pool.query('SELECT p.id, p.fec_creacion, p.descripcion, p.fec_inicio, p.documento, p.fec_final, p.estado, e.nombre, e.apellido, e.cedula, cp.descripcion AS nom_permiso FROM permisos AS p, empl_contratos AS ec, empleados AS e, cg_tipo_permisos AS cp WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND p.id_tipo_permiso = cp.id ORDER BY fec_creacion DESC');
        if (PERMISOS.rowCount > 0) {
            return res.json(PERMISOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ObtenerUnPermiso(req: Request, res: Response) {
        const id = req.params.id;
        const PERMISOS = await pool.query('SELECT * FROM permisos WHERE id = $1',[id]);
        if (PERMISOS.rowCount > 0) {
            return res.json(PERMISOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPermisos(req: Request, res: Response): Promise<void> {
        const { fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso } = req.body;
        await pool.query('INSERT INTO permisos (fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion, num_permiso]);
        const ultimo = await pool.query('SELECT id FROM permisos WHERE fec_creacion = $1 AND  id_tipo_permiso = $2 AND id_empl_contrato = $3', [fec_creacion, id_tipo_permiso, id_empl_contrato]);
        console.log(ultimo.rows[0].id);
        res.jsonp({ message: 'Permiso se registró con éxito', id: ultimo.rows[0].id });
    }

    public async ObtenerNumPermiso(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const NUMERO_PERMISO = await pool.query('SELECT MAX(p.num_permiso) FROM permisos AS p, empl_contratos AS ec, empleados AS e WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (NUMERO_PERMISO.rowCount > 0) {
            return res.jsonp(NUMERO_PERMISO.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' }).end;
        }
    }

    public async ObtenerPermisoContrato(req: Request, res: Response){
        try {   
            const { id_empl_contrato } = req.params;
            const PERMISO = await pool.query('SELECT * FROM VistaNombrePermiso  WHERE id_empl_contrato = $1', [id_empl_contrato]);
            return res.jsonp(PERMISO.rows)

        } catch (error) {
            return res.jsonp(null);
        }
    }

    public async getDoc(req: Request, res: Response): Promise<any> {
        const docs = req.params.docs;
        let filePath = `servidor\\docRespaldosPermisos\\${docs}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    public async guardarDocumentoPermiso(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let doc = list.uploads[0].path.split("\\")[1];
        let id = req.params.id
    
        await pool.query('UPDATE permisos SET documento = $2 WHERE id = $1', [id, doc]);
        res.jsonp({ message: 'Documento Actualizado'});
    }

    public async ActualizarEstado(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const { estado } = req.body;
        await pool.query('UPDATE permisos SET estado = $1 WHERE id = $2', [estado, id]);
        res.json({ message: 'Estado de permiso actualizado exitosamente' });
      }
}

export const PERMISOS_CONTROLADOR = new PermisosControlador();

export default PERMISOS_CONTROLADOR;