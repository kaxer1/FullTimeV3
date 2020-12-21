"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraficaInasistencia = void 0;
const database_1 = __importDefault(require("../database"));
function IdsEmpleados(id_empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT distinct co.id_empleado FROM sucursales AS s, cg_departamentos AS d, empl_cargos AS ca, empl_contratos AS co, empleados AS e WHERE s.id_empresa = $1 AND s.id = d.id_sucursal AND ca.id_sucursal = s.id AND d.id = ca.id_departamento AND co.id = ca.id_empl_contrato AND e.id = co.id_empleado AND e.estado = 1 ORDER BY e.apellido ASC', [id_empresa])
            .then(result => {
            return result.rows;
        });
    });
}
exports.GraficaInasistencia = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
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
        };
    });
};
