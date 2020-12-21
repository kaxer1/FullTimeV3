import pool from '../database';

async function IdsEmpleados(id_empresa: number) {
    return await pool.query('SELECT distinct co.id_empleado FROM sucursales AS s, cg_departamentos AS d, empl_cargos AS ca, empl_contratos AS co, empleados AS e WHERE s.id_empresa = $1 AND s.id = d.id_sucursal AND ca.id_sucursal = s.id AND d.id = ca.id_departamento AND co.id = ca.id_empl_contrato AND e.id = co.id_empleado AND e.estado = 1 ORDER BY e.apellido ASC',[id_empresa])
        .then(result => {
            return result.rows
        })
}

export const GraficaInasistencia = async function (id_empresa: number, fec_inicio: Date, fec_final: Date) {
    console.log(id_empresa, fec_inicio, fec_final);
    
    // let ids = await IdsEmpleados(id_empresa);
    return {
        // title: { text: 'Inasistencia 2020' },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                label: { backgroundColor: '#6a7985' }
            }
        },
        legend: {
            align: 'rigth',
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
            lineStyle: { color: 'rgb(20, 112, 233)' },
            itemStyle: { color: 'rgb(20, 112, 233)' }
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
            }
        ]
    }
}
