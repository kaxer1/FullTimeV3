import { Request, Response } from 'express';
import pool from '../../database';
const nodemailer = require("nodemailer");

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
        const PERMISOS = await pool.query('SELECT p.id, p.fec_creacion, p.descripcion, p.fec_inicio, p.documento, p.docu_nombre, p.fec_final, p.estado, e.nombre, e.apellido, e.cedula, cp.descripcion AS nom_permiso, ec.id AS id_contrato FROM permisos AS p, empl_contratos AS ec, empleados AS e, cg_tipo_permisos AS cp WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND p.id_tipo_permiso = cp.id ORDER BY fec_creacion DESC');
        if (PERMISOS.rowCount > 0) {
            return res.json(PERMISOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnPermisoInfo(req: Request, res: Response) {
        const id = req.params.id_permiso
        const PERMISOS = await pool.query('SELECT p.id, p.fec_creacion, p.descripcion, p.fec_inicio, p.documento, p.docu_nombre, p.fec_final, p.estado, e.nombre, e.apellido, e.cedula, cp.descripcion AS nom_permiso, ec.id AS id_contrato FROM permisos AS p, empl_contratos AS ec, empleados AS e, cg_tipo_permisos AS cp WHERE p.id = $1 AND  p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND p.id_tipo_permiso = cp.id ORDER BY fec_creacion DESC', [id]);
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
        const JefesDepartamentos = await pool.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s ,empl_contratos AS ecn, empleados AS e WHERE da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id');
        const correoInfoPidePermiso = await pool.query('SELECT distinct e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal FROM empl_contratos AS ecn, empleados AS e, empl_cargos AS ecr WHERE ecn.id = $1 AND ecn.id_empleado = e.id AND ecn.id = ecr.id_empl_contrato', [id_empl_contrato]);

        const email = 'kevincuray41@gmail.com';
        const pass = '2134Lamboclak';
        
        let smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: email,
              pass: pass
            }
        });

        JefesDepartamentos.rows.forEach(obj => {
            if (obj.id_dep === correoInfoPidePermiso.rows[0].id_departamento && obj.id_suc === correoInfoPidePermiso.rows[0].id_sucursal){
                var url = 'http://localhost:4200/ver-permiso';
                
                let data = {
                    to: obj.correo,
                    from: email,
                    template: 'hola',
                    subject: 'Solicitud de permiso',
                    html: `<p><b>${correoInfoPidePermiso.rows[0].nombre} ${correoInfoPidePermiso.rows[0].apellido}</b> con número de
                    cédula ${correoInfoPidePermiso.rows[0].cedula} solicita autorización de permiso: </p>
                    <a href="${url}/${ultimo.rows[0].id}">Ir a verificar permisos</a>`
                };
                console.log(data);
                smtpTransport.sendMail(data, async (error: any, info: any) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });
            }
        });     
        
        res.json({ message: 'Permiso se registró con éxito', id: ultimo.rows[0].id });
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