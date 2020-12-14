import { Request, Response } from 'express';
import pool from '../../database';

class GraficasControlador {

    public async ObtenerInasistencia(req: Request, res: Response): Promise<void> {
        // const { id_reloj, id_enrolado } = req.body;

        res.status(200).jsonp({
            title: {
                text: 'Inasistencia 2020'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                // align: 'rigth',
                data: [{
                    name: 'inasistencias'
                }]
            },
            grid: {
                left: '4%',
                right: '4%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'inasistencias',
                data: [3, 10, 5, 6, 7, 9, 15, 1, 2, 4, 10, 20],
                type: 'line',
                lineStyle: {
                    color: 'rgb(20, 112, 233)'
                },
                itemStyle: {
                    color: 'rgb(20, 112, 233)'
                }
            }],
            dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter',
                    backgroundColor: 'rgb(20, 112, 233)',
                    startValue: 'Enero',
                    endValue: 'Junio'
                },
            ]
        });
    }

}

export const GRAFICAS_CONTROLADOR = new GraficasControlador();

export default GRAFICAS_CONTROLADOR;