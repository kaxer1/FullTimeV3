import pool from '../../database';
import { Request, Response } from 'express';
// import { ContarHoras } from '../../libs/contarHoras'

class TimbresControlador {

    public async ObtenerRealTimeTimbresEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params
        console.log(id_empleado);        
        const TIMBRES_NOTIFICACION = await pool.query('SELECT * FROM realtime_timbres WHERE id_receives_empl = $1 ORDER BY create_at DESC LIMIT 5', [id_empleado])
        .then(async(result) => {

            if (result.rowCount > 0) {
                return await Promise.all( result.rows.map(async (obj): Promise<any> => {   
                     
                    let nombre = await pool.query('SELECT nombre, apellido FROM empleados WHERE id = $1',[obj.id_send_empl]).then(ele => {
                        console.log(ele.rows[0].nombre + ele.rows[0].apellido);
                        return ele.rows[0].nombre + ' ' + ele.rows[0].apellido
                    })
                    return {
                        create_at: obj.create_at,
                        descripcion: obj.descripcion,
                        visto: obj.visto,
                        id_timbre: obj.id_timbre,
                        empleado: nombre,
                        id: obj.id,
                        tipo: obj.tipo
                    }
                }));
            }
            return []
        });
                
        if (TIMBRES_NOTIFICACION.length > 0) {
            return res.jsonp(TIMBRES_NOTIFICACION)
        }
        
        return res.status(404).jsonp({ message: 'No se encuentran registros'});
    }

    public async ObtenerAvisosTimbresEmpleado(req: Request, res: Response) {
        const { id_empleado } = req.params
        console.log(id_empleado);        
        const TIMBRES_NOTIFICACION = await pool.query('SELECT * FROM realtime_timbres WHERE id_receives_empl = $1 ORDER BY create_at DESC', [id_empleado])
        .then(async(result) => {

            if (result.rowCount > 0) {
                return await Promise.all( result.rows.map(async (obj): Promise<any> => {    
                    let nombre = await pool.query('SELECT nombre, apellido FROM empleados WHERE id = $1',[obj.id_send_empl]).then(ele => {
                        return ele.rows[0].nombre + ' ' + ele.rows[0].apellido
                    })
                    return {
                        create_at: obj.create_at,
                        descripcion: obj.descripcion,
                        visto: obj.visto,
                        id_timbre: obj.id_timbre,
                        empleado: nombre,
                        id: obj.id
                    }
                }));
            }
            return []
        });
                
        if (TIMBRES_NOTIFICACION.length > 0) {
            return res.jsonp(TIMBRES_NOTIFICACION)
        }
        
        return res.status(404).jsonp({ message: 'No se encuentran registros'});
    }

    public async ActualizarVista(req: Request, res: Response): Promise<void> {
        const id = req.params.id_noti_timbre;
        const { visto } = req.body;
        console.log(id, visto);
        await pool.query('UPDATE realtime_timbres SET visto = $1 WHERE id = $2', [visto, id])
            .then(result => {
                res.jsonp({ message: 'Vista Actualizada' });
            });
    }

    public async EliminarMultiplesAvisos(req: Request, res: Response): Promise<any> {
        const arrayIdsRealtimeTimbres = req.body;
        console.log(arrayIdsRealtimeTimbres);
    
        if (arrayIdsRealtimeTimbres.length > 0) {
            arrayIdsRealtimeTimbres.forEach(async(obj: number) => {
                await pool.query('DELETE FROM realtime_timbres WHERE id = $1', [obj]) 
                .then(result => {
                    console.log(result.command, 'REALTIME ELIMINADO ====>', obj);
                });
            });
            return res.jsonp({message: 'Todos las notificaciones han sido eliminadas'});
        }
        return  res.jsonp({message: 'No seleccionó ningún timbre'});
    }

}

export const timbresControlador = new TimbresControlador;
export default timbresControlador