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
        const { fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion } = req.body;
        await pool.query('INSERT INTO permisos (fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [fec_creacion, descripcion, fec_inicio, fec_final, dia, hora_numero, legalizado, estado, dia_libre, id_tipo_permiso, id_empl_contrato, id_peri_vacacion]);
        const ultimo = await pool.query('SELECT id FROM permisos WHERE fec_creacion = $1,  id_tipo_permiso = $2, id_empl_contrato = $3,', [fec_creacion, id_tipo_permiso, id_empl_contrato,]);
        console.log(ultimo.rows[0]);
        res.json({ message: 'Permiso se registró con éxito', id: ultimo.rows[0] });
    }

    public async getDoc(req: Request, res: Response): Promise<any> {
        const imagen = req.params.imagen;
        let filePath = `servidor\\docRespaldosPermisos\\${imagen}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    public async guardarDocumentoPermiso(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        console.log(list);
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