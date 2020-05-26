import { Request, Response } from 'express';
import pool from '../../database';

class PermisosControlador {

    public async ListarPermisos(req: Request, res: Response) {
        const PERMISOS = await pool.query('SELECT * FROM permisos');
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
        res.json({ message: 'Permiso se registró con éxito' });
    }

    public async ObtenerNumPermiso(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const NUMERO_PERMISO = await pool.query('SELECT MAX(p.num_permiso) FROM permisos AS p, empl_contratos AS ec, empleados AS e WHERE p.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
        if (NUMERO_PERMISO.rowCount > 0) {
            return res.json(NUMERO_PERMISO.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' }).end;
        }
    }

    public async ObtenerPermisoContrato(req: Request, res: Response){
        try {
            const { id_empl_contrato } = req.params;
            const PERMISO = await pool.query('SELECT * FROM VistaNombrePermiso  WHERE id_empl_contrato = $1', [id_empl_contrato]);
            return res.json(PERMISO.rows)
        } catch (error) {
            return res.json(null);
        }
    }

    public async getDoc(req: Request, res: Response): Promise<any> {
        const imagen = req.params.imagen;
        let filePath = `servidor\\docRespaldosPermisos\\${imagen}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    public async guardarDocumentoPermiso(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        // let imagen = list.image[0].path.split("\\")[1];
        // let id = req.params.id_empleado
    
        // const unEmpleado = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
        // if (unEmpleado.rowCount > 0) {
        //   unEmpleado.rows.map(async (obj) => {
        //     if (obj.imagen != null ){
        //       try {
        //         console.log(obj.imagen);
        //         let filePath = `servidor\\imagenesEmpleados\\${obj.imagen}`;
        //         let direccionCompleta = __dirname.split("servidor")[0] + filePath;
        //         fs.unlinkSync(direccionCompleta);
        //         await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
        //         res.json({ message: 'Imagen Actualizada'});
        //       } catch (error) {
        //         await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
        //         res.json({ message: 'Imagen Actualizada'});
        //       }
        //     } else {
        //       await pool.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
        //       res.json({ message: 'Imagen Actualizada'});
        //     }
        //   });
        // }
    }
}

export const PERMISOS_CONTROLADOR = new PermisosControlador();

export default PERMISOS_CONTROLADOR;