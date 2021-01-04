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
Object.defineProperty(exports, "__esModule", { value: true });
class GraficasControlador {
    ObtenerInasistencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.GRAFICAS_CONTROLADOR = new GraficasControlador();
exports.default = exports.GRAFICAS_CONTROLADOR;
