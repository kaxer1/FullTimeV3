import { Request, Response } from 'express';
import pool from '../../database';
const nodemailer = require("nodemailer");

class AutorizacionesControlador {

    public async ListarAutorizaciones(req: Request, res: Response) {
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones ORDER BY id');
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ObtenerAutorizacionPorIdDocumento(req: Request, res: Response) {
        const id = req.params.id_documento
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones WHERE id_documento = $1', [id]);
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES .rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearAutorizacion(req: Request, res: Response): Promise<any> {
        const { id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento} = req.body;
        await pool.query('INSERT INTO autorizaciones ( id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_documento, tipo_documento, orden, estado, id_notificacion, id_noti_autorizacion, id_departamento]);
        res.jsonp({ message: 'Autorizacion guardado'});
    }

    public async ActualizarEstado(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const { estado, id_permiso, id_departamento } = req.body;
        await pool.query('UPDATE autorizaciones SET estado = $1 WHERE id = $2', [estado, id]);
        const JefeDepartamento = await pool.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo, e.apellido FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id', [id_departamento]);
        const InfoPermisoReenviarEstadoEmpleado = await pool.query('SELECT p.id, p.descripcion, p.estado, e.cedula, e.nombre, e.apellido, e.correo FROM permisos AS p, empl_contratos AS c, empleados AS e WHERE p.id = $1 AND p.id_empl_contrato = c.id AND c.id_empleado = e.id', [id_permiso]);

        const estadoAutorizacion = [
            { id: 1, nombre: 'Pendiente'},
            { id: 2, nombre: 'Pre-autorizado'},
            { id: 3, nombre: 'Autorizado'},
            { id: 4, nombre: 'Negado'},
        ];

        let nombreEstado = '';
        estadoAutorizacion.forEach(obj => {
            if (obj.id === estado) {
                nombreEstado = obj.nombre
            }
        })
        
        const email = process.env.EMAIL;
        const pass = process.env.PASSWORD;
        
        let smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: email,
              pass: pass
            }
        });

        JefeDepartamento.rows.forEach(obj => {
            var url = 'http://localhost:4200/datosEmpleado';
            InfoPermisoReenviarEstadoEmpleado.rows.forEach(ele => {
                let data = {
                    from: obj.correo,
                    to: ele.correo,
                    template: 'hola',
                    subject: 'Estado de solicitud de permiso',
                    html: `<p><b>${obj.nombre} ${obj.apellido}</b> jefe/a del departamento de <b>${obj.departamento}</b> con número de
                    cédula ${obj.cedula} a cambiado el estado de su permiso a: <b>${nombreEstado}</b></p>
                    <h4><b>Informacion del permiso</b></h4>
                    <ul>
                        <li><b>Descripción</b>: ${ele.descripcion} </li>
                        <li><b>Empleado</b>: ${ele.nombre} ${ele.apellido} </li>
                        <li><b>Cédula</b>: ${ele.cedula} </li>
                        <li><b>Sucursal</b>: ${obj.sucursal} </li>
                        <li><b>Departamento</b>: ${obj.departamento} </li>
                        </ul>
                    <a href="${url}">Ir a verificar estado permisos</a>`
                };
                console.log(data);
                smtpTransport.sendMail(data, async (error: any, info: any) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
        });     
        
        res.json({ message: 'Estado de permiso actualizado exitosamente' });
    }
}

export const AUTORIZACION_CONTROLADOR = new AutorizacionesControlador();

export default AUTORIZACION_CONTROLADOR;