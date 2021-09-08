import { Request, Response } from 'express'
import { dep, emp, IHorarioTrabajo, IReporteAtrasos, IReportePuntualidad, IReporteTimbres, tim_tabulado } from '../../class/Asistencia';
import pool from '../../database'

class ReportesAsistenciaControlador {

    public async ReporteTimbresMultiple(req: Request, res: Response) {

        let { desde, hasta } = req.params;
        let datos: any[] = req.body;
    
        let n: Array<any> = await Promise.all(datos.map(async (obj: IReporteTimbres) => {
            obj.departamentos = await Promise.all(obj.departamentos.map(async (ele) => {
                ele.empleado = await Promise.all(ele.empleado.map(async (o) => {
                    o.timbres = await BuscarTimbres(desde, hasta, o.codigo);
                    console.log('Timbres: ', o);
                    return o
                })
                )
                return ele
            })
            )
            return obj
        })
        )


        let nuevo = n.map((obj: IReporteTimbres) => {

            obj.departamentos = obj.departamentos.map((e) => {

                e.empleado = e.empleado.filter((t: any) => { return t.timbres.length > 0 })
                return e

            }).filter((e: any) => { return e.empleado.length > 0 })
            return obj

        }).filter(obj => { return obj.departamentos.length > 0 })

        if (nuevo.length === 0) return res.status(400).jsonp({ message: 'No hay timbres de empleados en ese periodo' })

        return res.status(200).jsonp(nuevo)

    }

}
const VACUNAS_REPORTE_CONTROLADOR = new ReportesAsistenciaControlador();
export default VACUNAS_REPORTE_CONTROLADOR;

const BuscarTimbres = async function (fec_inicio: string, fec_final: string, codigo: string | number) {
    return await pool.query('SELECT CAST(fec_hora_timbre AS VARCHAR), id_reloj, accion, observacion, latitud, longitud, CAST(fec_hora_timbre_servidor AS VARCHAR)  FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) between $1 || \'%\' AND $2 || \'%\' AND id_empleado = $3 ORDER BY fec_hora_timbre ASC ', [fec_inicio, fec_final, codigo])
        .then(res => {
            return res.rows;
        })
}