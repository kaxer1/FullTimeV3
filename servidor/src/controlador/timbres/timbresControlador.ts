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

    public async CrearTimbreWeb(req: Request, res: Response): Promise<any> {
        try {
            const {fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_reloj} = req.body
            const id_empleado = req.userIdEmpleado
            let code = await pool.query('SELECT codigo FROM empleados WHERE id = $1', [id_empleado]).then(result => { return result.rows});
            if (code.length === 0) return {mensaje: 'El empleado no tiene un codigo asignado.'};
            var codigo = parseInt(code[0].codigo); 
            
            await pool.query('INSERT INTO timbres (fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_empleado, id_reloj) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',[fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, codigo, id_reloj])
            .then(result => {
                res.status(200).jsonp({message: 'Timbre enviado'});
            }).catch(err => {
                res.status(400).jsonp({message: err});
            })
        } catch (error) {
            res.status(400).jsonp({message: error});
        }
    }

    public async CrearTimbreWebAdmin(req: Request, res: Response): Promise<any> {
        try {
            const {fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_empleado, id_reloj} = req.body
            console.log(req.body);
            
            let code = await pool.query('SELECT codigo FROM empleados WHERE id = $1', [id_empleado]).then(result => { return result.rows});
            if (code.length === 0) return {mensaje: 'El empleado no tiene un codigo asignado.'};
            var codigo = parseInt(code[0].codigo); 
            
            await pool.query('INSERT INTO timbres (fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_empleado, id_reloj) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',[fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, codigo, id_reloj])
            .then(result => {
                res.status(200).jsonp({message: 'Timbre guardado'});
            }).catch(err => {
                res.status(400).jsonp({message: err});
            })
        } catch (error) {
            res.status(400).jsonp({message: error});
        }
    }

    public async ObtenerTimbres(req: Request, res: Response): Promise<any> {
        try {
            const id = req.userIdEmpleado;
            let timbres = await pool.query('SELECT t.fec_hora_timbre, t.accion, t.tecl_funcion, t.observacion, t.latitud, t.longitud, t.id_empleado, t.id_reloj ' +
            'FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado ORDER BY t.fec_hora_timbre DESC LIMIT 100', [id]).then(result => {
                return result.rows.map(obj => {
                    obj.fec_hora_timbre.setUTCHours(obj.fec_hora_timbre.getUTCHours() - 5);
                    console.log(obj.fec_hora_timbre.getUTCHours());
                    return obj
                })
            });

            
            if (timbres.length === 0) return res.status(400).jsonp({message: 'No hay timbres'});
            
            let estado_cuenta = [{
                timbres_PES: await pool.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado AND t.accion = \'PES\' ', [id]).then(result => {return result.rows[0].count}),
                timbres_AES: await pool.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado AND t.accion = \'AES\' ', [id]).then(result => {return result.rows[0].count}),
                timbres_EoS: await pool.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado AND t.accion = \'EoS\' ', [id]).then(result => {return result.rows[0].count}),
                total_timbres: await pool.query('SELECT count(*) FROM empleados AS e, timbres AS t WHERE e.id = $1 AND CAST(e.codigo AS integer) = t.id_empleado', [id]).then(result => {return result.rows[0].count})
            }]

            return res.status(200).jsonp({
                timbres: timbres, 
                cuenta: estado_cuenta, 
                info: await pool.query('SELECT ca.cargo, ca.sueldo, ca.hora_trabaja, eh.fec_inicio, eh.fec_final FROM empl_contratos AS co, empl_cargos AS ca, empl_horarios AS eh ' +
                    'WHERE co.id_empleado = $1 AND ca.id_empl_contrato = co.id AND eh.id_empl_cargo = ca.id ORDER BY eh.fec_inicio DESC LIMIT 1',[id]).then(result => {
                        console.log(result.rows);        
                        return result.rows
                    }),
            });
        } catch (error) {
            console.log(error);
            res.status(400).jsonp({message: error})
        }
    }

}

export const timbresControlador = new TimbresControlador;
export default timbresControlador