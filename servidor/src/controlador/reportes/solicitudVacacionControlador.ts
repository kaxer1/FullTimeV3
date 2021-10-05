import { Request, Response } from 'express'
import { ReporteVacacion } from '../../class/Vacaciones';
import pool from '../../database'

class SolicitudVacacionesControlador {

    public async ReporteVacacionesMultiple(req: Request, res: Response) {
        console.log('datos recibidos', req.body)
        let datos: any[] = req.body;
        let { desde, hasta } = req.params;
        let n: Array<any> = await Promise.all(datos.map(async (obj: ReporteVacacion) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async (ele) => {
                ele.empleado = await Promise.all(ele.empleado.map(async (o) => {
                    o.vacaciones = await BuscarVacaciones(o.codigo, desde, hasta);
                    console.log('Vacaciones: ', o);
                    return o
                })
                )
                return ele
            })
            )
            return obj
        })
        )


        let nuevo = n.map((obj: ReporteVacacion) => {

            obj.departamentos = obj.departamentos.map((e) => {

                e.empleado = e.empleado.filter((v: any) => { return v.vacaciones.length > 0 })
                return e

            }).filter((e: any) => { return e.empleado.length > 0 })
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({ message: 'No se ha encontrado registro de vacaciones.' })

        return res.status(200).jsonp(nuevo)

    }

}

const VACACIONES_REPORTE_CONTROLADOR = new SolicitudVacacionesControlador();
export default VACACIONES_REPORTE_CONTROLADOR;

const BuscarVacaciones = async function (id: number, desde: string, hasta: string) {
    return await pool.query('SELECT v.fec_inicio, v.fec_final, v.fec_ingreso,v.id AS id_vacacion, ' +
    'a.id_documento ' +
    'FROM vacaciones AS v, autorizaciones AS a ' +
    'WHERE v.id = a.id_vacacion AND v.codigo = $1 AND fec_inicio BETWEEN $2 AND $3',
        [id, desde, hasta])
        .then(res => {
            return res.rows;
        })
}