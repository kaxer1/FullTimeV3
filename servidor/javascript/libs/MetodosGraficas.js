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
const database_1 = __importDefault(require("../database"));
const SubMetodosGraficas_1 = require("./SubMetodosGraficas");
exports.GraficaInasistencia = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empresa, fec_inicio, fec_final);
        let horarios = yield SubMetodosGraficas_1.BuscarHorariosActivos(fec_inicio.toJSON().split('T')[0], fec_final.toJSON().split('T')[0]);
        let array = yield Promise.all(horarios.map((obj) => __awaiter(this, void 0, void 0, function* () {
            obj.horario = yield SubMetodosGraficas_1.BuscarTimbresByCodigo_Fecha(obj.codigo, obj.horario);
            return obj;
        })));
        let modelarAnio = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        array.forEach(obj => {
            console.log(obj);
            obj.horario.forEach((ele) => {
                let fecha = parseInt(ele.fecha.split('-')[1]);
                if (ele.timbresTotal === 0) {
                    switch (fecha) {
                        case 1:
                            modelarAnio.enero.push(ele.fecha);
                            break;
                        case 2:
                            modelarAnio.febrero.push(ele.fecha);
                            break;
                        case 3:
                            modelarAnio.marzo.push(ele.fecha);
                            break;
                        case 4:
                            modelarAnio.abril.push(ele.fecha);
                            break;
                        case 5:
                            modelarAnio.mayo.push(ele.fecha);
                            break;
                        case 6:
                            modelarAnio.junio.push(ele.fecha);
                            break;
                        case 7:
                            modelarAnio.julio.push(ele.fecha);
                            break;
                        case 8:
                            modelarAnio.agosto.push(ele.fecha);
                            break;
                        case 9:
                            modelarAnio.septiembre.push(ele.fecha);
                            break;
                        case 10:
                            modelarAnio.octubre.push(ele.fecha);
                            break;
                        case 11:
                            modelarAnio.noviembre.push(ele.fecha);
                            break;
                        case 12:
                            modelarAnio.diciembre.push(ele.fecha);
                            break;
                        default: break;
                    }
                }
            });
        });
        horarios = [];
        array = [];
        let data = [
            { id: 0, mes: 'Enero', valor: modelarAnio.enero.length },
            { id: 1, mes: 'Febrero', valor: modelarAnio.febrero.length },
            { id: 2, mes: 'Marzo', valor: modelarAnio.marzo.length },
            { id: 3, mes: 'Abril', valor: modelarAnio.abril.length },
            { id: 4, mes: 'Mayo', valor: modelarAnio.mayo.length },
            { id: 5, mes: 'Junio', valor: modelarAnio.junio.length },
            { id: 6, mes: 'Julio', valor: modelarAnio.julio.length },
            { id: 7, mes: 'Agosto', valor: modelarAnio.agosto.length },
            { id: 8, mes: 'Septiembre', valor: modelarAnio.septiembre.length },
            { id: 9, mes: 'Octubre', valor: modelarAnio.octubre.length },
            { id: 10, mes: 'Noviembre', valor: modelarAnio.noviembre.length },
            { id: 11, mes: 'Diciembre', valor: modelarAnio.diciembre.length }
        ];
        let meses = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.mes; });
        let valor_mensual = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'line', label: { backgroundColor: '#6a7985' } }
            },
            legend: { align: 'left', data: [{ name: 'inasistencias' }] },
            grid: { left: '4%', containLabel: true },
            xAxis: { type: 'category', name: 'Meses', data: meses },
            yAxis: { type: 'value', name: 'N° Inasistencias' },
            series: [{
                    name: 'faltas',
                    data: valor_mensual,
                    type: 'line',
                    lineStyle: { color: 'rgb(20, 112, 233)' },
                    itemStyle: { color: 'rgb(20, 112, 233)' }
                }],
        };
    });
};
exports.GraficaRetrasos = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empresa, fec_inicio, fec_final);
        let timbres = yield SubMetodosGraficas_1.BuscarTimbresEoS(fec_inicio.toJSON().split('T')[0], fec_final.toJSON().split('T')[0]);
        // console.log(timbres);
        let modelarAnio = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        let array = yield Promise.all(timbres.map((obj) => __awaiter(this, void 0, void 0, function* () {
            return yield SubMetodosGraficas_1.ModelarAtrasos(obj, fec_inicio.toJSON().split('T')[0], fec_final.toJSON().split('T')[0]);
        })));
        array.forEach((ele) => {
            let fecha = parseInt(ele.fecha.split('-')[1]);
            if (ele.retraso === true) {
                switch (fecha) {
                    case 1:
                        modelarAnio.enero.push(ele.fecha);
                        break;
                    case 2:
                        modelarAnio.febrero.push(ele.fecha);
                        break;
                    case 3:
                        modelarAnio.marzo.push(ele.fecha);
                        break;
                    case 4:
                        modelarAnio.abril.push(ele.fecha);
                        break;
                    case 5:
                        modelarAnio.mayo.push(ele.fecha);
                        break;
                    case 6:
                        modelarAnio.junio.push(ele.fecha);
                        break;
                    case 7:
                        modelarAnio.julio.push(ele.fecha);
                        break;
                    case 8:
                        modelarAnio.agosto.push(ele.fecha);
                        break;
                    case 9:
                        modelarAnio.septiembre.push(ele.fecha);
                        break;
                    case 10:
                        modelarAnio.octubre.push(ele.fecha);
                        break;
                    case 11:
                        modelarAnio.noviembre.push(ele.fecha);
                        break;
                    case 12:
                        modelarAnio.diciembre.push(ele.fecha);
                        break;
                    default: break;
                }
            }
        });
        timbres = [];
        let data = [
            { id: 0, mes: 'Enero', valor: modelarAnio.enero.length },
            { id: 1, mes: 'Febrero', valor: modelarAnio.febrero.length },
            { id: 2, mes: 'Marzo', valor: modelarAnio.marzo.length },
            { id: 3, mes: 'Abril', valor: modelarAnio.abril.length },
            { id: 4, mes: 'Mayo', valor: modelarAnio.mayo.length },
            { id: 5, mes: 'Junio', valor: modelarAnio.junio.length },
            { id: 6, mes: 'Julio', valor: modelarAnio.julio.length },
            { id: 7, mes: 'Agosto', valor: modelarAnio.agosto.length },
            { id: 8, mes: 'Septiembre', valor: modelarAnio.septiembre.length },
            { id: 9, mes: 'Octubre', valor: modelarAnio.octubre.length },
            { id: 10, mes: 'Noviembre', valor: modelarAnio.noviembre.length },
            { id: 11, mes: 'Diciembre', valor: modelarAnio.diciembre.length }
        ];
        let meses = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.mes; });
        let valor_mensual = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        return {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                align: 'left',
                data: [{ name: 'faltas' }]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    name: 'Meses',
                    type: 'category',
                    data: meses,
                    axisTick: { alignWithLabel: true }
                }
            ],
            yAxis: [{ type: 'value', name: 'N° Atrasos' }],
            series: [{
                    name: 'retrasos',
                    type: 'bar',
                    barWidth: '60%',
                    data: valor_mensual
                }]
        };
    });
};
exports.GraficaAsistencia = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empresa, fec_inicio, fec_final);
        let horarios = yield SubMetodosGraficas_1.BuscarHorariosActivos(fec_inicio.toJSON().split('T')[0], fec_final.toJSON().split('T')[0]);
        let array = yield Promise.all(horarios.map((obj) => __awaiter(this, void 0, void 0, function* () {
            obj.horario = yield SubMetodosGraficas_1.BuscarTimbresByCodigo_Fecha(obj.codigo, obj.horario);
            return obj;
        })));
        let modelarPie = {
            presente: [],
            a_justifi: [],
            a_no_justi: [],
        };
        array.forEach(obj => {
            obj.horario.forEach((ele) => {
                let fecha = parseInt(ele.fecha.split('-')[1]);
                if (ele.timbresTotal === 0) {
                    modelarPie.a_no_justi.push(fecha);
                }
                else {
                    modelarPie.presente.push(fecha);
                }
            });
        });
        horarios = [];
        array = [];
        return {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                data: ['Ausencia justificada', 'Ausencia no justificada', 'Presente']
            },
            series: [
                {
                    name: 'Asistencia',
                    type: 'pie',
                    radius: ['15%', '30%'],
                    labelLine: {
                        length: 30,
                    },
                    label: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#F6F8FC',
                        borderColor: '#8C8D8E',
                        borderWidth: 1,
                        borderRadius: 4,
                        rich: {
                            a: {
                                color: '#6E7079',
                                lineHeight: 22,
                                align: 'center'
                            },
                            hr: {
                                borderColor: '#8C8D8E',
                                width: '100%',
                                borderWidth: 1,
                                height: 0
                            },
                            b: {
                                color: '#4C5058',
                                fontSize: 14,
                                fontWeight: 'bold',
                                lineHeight: 33
                            },
                            per: {
                                color: '#fff',
                                backgroundColor: '#4C5058',
                                padding: [3, 4],
                                borderRadius: 4
                            }
                        }
                    },
                    data: [
                        { value: modelarPie.a_justifi.length, name: 'Ausencia justificada' },
                        { value: modelarPie.a_no_justi.length, name: 'Ausencia no justificada' },
                        { value: modelarPie.presente.length, name: 'Presente', selected: true }
                    ]
                }
            ]
        };
    });
};
exports.GraficaHorasExtras = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empresa, fec_inicio, fec_final);
        let horas_extras = yield SubMetodosGraficas_1.HoraExtra_ModelarDatos(fec_inicio, fec_final);
        let modelarAnio = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        horas_extras.forEach((obj) => {
            let fecha = parseInt(obj.fecha.split('-')[1]);
            // console.log(fecha.getMonth());
            switch (fecha) {
                case 1:
                    modelarAnio.enero.push(obj.tiempo);
                    break;
                case 2:
                    modelarAnio.febrero.push(obj.tiempo);
                    break;
                case 3:
                    modelarAnio.marzo.push(obj.tiempo);
                    break;
                case 4:
                    modelarAnio.abril.push(obj.tiempo);
                    break;
                case 5:
                    modelarAnio.mayo.push(obj.tiempo);
                    break;
                case 6:
                    modelarAnio.junio.push(obj.tiempo);
                    break;
                case 7:
                    modelarAnio.julio.push(obj.tiempo);
                    break;
                case 8:
                    modelarAnio.agosto.push(obj.tiempo);
                    break;
                case 9:
                    modelarAnio.septiembre.push(obj.tiempo);
                    break;
                case 10:
                    modelarAnio.octubre.push(obj.tiempo);
                    break;
                case 11:
                    modelarAnio.noviembre.push(obj.tiempo);
                    break;
                case 12:
                    modelarAnio.diciembre.push(obj.tiempo);
                    break;
                default: break;
            }
        });
        // console.log(modelarAnio);
        horas_extras = [];
        let data = [
            { id: 0, mes: 'Enero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.enero) },
            { id: 1, mes: 'Febrero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.febrero) },
            { id: 2, mes: 'Marzo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.marzo) },
            { id: 3, mes: 'Abril', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.abril) },
            { id: 4, mes: 'Mayo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.mayo) },
            { id: 5, mes: 'Junio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.junio) },
            { id: 6, mes: 'Julio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.julio) },
            { id: 7, mes: 'Agosto', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.agosto) },
            { id: 8, mes: 'Septiembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.septiembre) },
            { id: 9, mes: 'Octubre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.octubre) },
            { id: 10, mes: 'Noviembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.noviembre) },
            { id: 11, mes: 'Diciembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.diciembre) }
        ];
        // console.log(data);
        let meses = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.mes; });
        let valor_mensual = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        return {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            xAxis: { type: 'category', name: 'Meses', data: meses },
            yAxis: { type: 'value', name: 'N° Horas' },
            series: [{
                    data: valor_mensual,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)'
                    }
                }]
        };
    });
};
exports.GraficaJornada_VS_HorasExtras = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('ingreso a jornada ', id_empresa, fec_inicio, fec_final);
        /**
         * Para Horas Extras
         */
        let horas_extras = yield SubMetodosGraficas_1.HoraExtra_ModelarDatos(fec_inicio, fec_final);
        let modelarAnio = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        horas_extras.forEach((obj) => {
            let fecha = parseInt(obj.fecha.split('-')[1]);
            // console.log(fecha.getMonth());
            switch (fecha) {
                case 1:
                    modelarAnio.enero.push(obj.tiempo);
                    break;
                case 2:
                    modelarAnio.febrero.push(obj.tiempo);
                    break;
                case 3:
                    modelarAnio.marzo.push(obj.tiempo);
                    break;
                case 4:
                    modelarAnio.abril.push(obj.tiempo);
                    break;
                case 5:
                    modelarAnio.mayo.push(obj.tiempo);
                    break;
                case 6:
                    modelarAnio.junio.push(obj.tiempo);
                    break;
                case 7:
                    modelarAnio.julio.push(obj.tiempo);
                    break;
                case 8:
                    modelarAnio.agosto.push(obj.tiempo);
                    break;
                case 9:
                    modelarAnio.septiembre.push(obj.tiempo);
                    break;
                case 10:
                    modelarAnio.octubre.push(obj.tiempo);
                    break;
                case 11:
                    modelarAnio.noviembre.push(obj.tiempo);
                    break;
                case 12:
                    modelarAnio.diciembre.push(obj.tiempo);
                    break;
                default: break;
            }
        });
        horas_extras = [];
        let data = [
            { id: 0, mes: 'Enero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.enero) },
            { id: 1, mes: 'Febrero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.febrero) },
            { id: 2, mes: 'Marzo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.marzo) },
            { id: 3, mes: 'Abril', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.abril) },
            { id: 4, mes: 'Mayo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.mayo) },
            { id: 5, mes: 'Junio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.junio) },
            { id: 6, mes: 'Julio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.julio) },
            { id: 7, mes: 'Agosto', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.agosto) },
            { id: 8, mes: 'Septiembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.septiembre) },
            { id: 9, mes: 'Octubre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.octubre) },
            { id: 10, mes: 'Noviembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.noviembre) },
            { id: 11, mes: 'Diciembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.diciembre) }
        ];
        // let meses = data.filter(obj => {return ( obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth() )}).map(obj => {return obj.mes});    
        let valor_mensual_hora_extra = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        /**
         * Para tiempo de joranda
         */
        let timbres = yield SubMetodosGraficas_1.BuscarTimbresEoSModelado(fec_inicio.toJSON().split('T')[0], fec_final.toJSON().split('T')[0]);
        let nuevo = timbres.filter(obj => {
            return obj.horario.length != 0;
        }).map(obj => {
            obj.horario.forEach(ele => {
                ele.hora = SubMetodosGraficas_1.HHMMtoHorasDecimal(ele.hora);
            });
            return obj;
        });
        let modelarAnioTiempoJornada = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        timbres = [];
        nuevo.forEach(obj => {
            obj.timbres.forEach((ele) => {
                ele.registros.forEach((obj1) => {
                    if (obj.horario[0].hora < obj1.fec_hora_timbre) {
                        obj.respuesta.push({
                            fecha: ele.fecha,
                            total: obj1.fec_hora_timbre - obj.horario[0].hora
                        });
                    }
                });
            });
        });
        nuevo.forEach(ele => {
            ele.respuesta.forEach(obj => {
                let fecha = parseInt(obj.fecha.split('-')[1]);
                switch (fecha) {
                    case 1:
                        modelarAnioTiempoJornada.enero.push(obj.total);
                        break;
                    case 2:
                        modelarAnioTiempoJornada.febrero.push(obj.total);
                        break;
                    case 3:
                        modelarAnioTiempoJornada.marzo.push(obj.total);
                        break;
                    case 4:
                        modelarAnioTiempoJornada.abril.push(obj.total);
                        break;
                    case 5:
                        modelarAnioTiempoJornada.mayo.push(obj.total);
                        break;
                    case 6:
                        modelarAnioTiempoJornada.junio.push(obj.total);
                        break;
                    case 7:
                        modelarAnioTiempoJornada.julio.push(obj.total);
                        break;
                    case 8:
                        modelarAnioTiempoJornada.agosto.push(obj.total);
                        break;
                    case 9:
                        modelarAnioTiempoJornada.septiembre.push(obj.total);
                        break;
                    case 10:
                        modelarAnioTiempoJornada.octubre.push(obj.total);
                        break;
                    case 11:
                        modelarAnioTiempoJornada.noviembre.push(obj.total);
                        break;
                    case 12:
                        modelarAnioTiempoJornada.diciembre.push(obj.total);
                        break;
                    default: break;
                }
            });
        });
        let data_tiempo_jornada = [
            { id: 0, mes: 'Enero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.enero) },
            { id: 1, mes: 'Febrero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.febrero) },
            { id: 2, mes: 'Marzo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.marzo) },
            { id: 3, mes: 'Abril', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.abril) },
            { id: 4, mes: 'Mayo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.mayo) },
            { id: 5, mes: 'Junio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.junio) },
            { id: 6, mes: 'Julio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.julio) },
            { id: 7, mes: 'Agosto', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.agosto) },
            { id: 8, mes: 'Septiembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.septiembre) },
            { id: 9, mes: 'Octubre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.octubre) },
            { id: 10, mes: 'Noviembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.noviembre) },
            { id: 11, mes: 'Diciembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.diciembre) }
        ];
        let valor_mensual_tiempo = data_tiempo_jornada.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        return {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                name: 'tiempo',
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: ['Horas extra', 'Jornada']
            },
            series: [
                {
                    type: 'pie',
                    radius: '55%',
                    center: ['40%', '50%'],
                    data: [
                        { value: SubMetodosGraficas_1.SumarValoresArray(valor_mensual_hora_extra), name: 'Horas extra' },
                        { value: SubMetodosGraficas_1.SumarValoresArray(valor_mensual_tiempo), name: 'Jornada' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    });
};
exports.GraficaTiempoJornada_VS_HorasExtras = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empresa, fec_inicio, fec_final);
        /**
         * Para Horas Extras
         */
        let horas_extras = yield SubMetodosGraficas_1.HoraExtra_ModelarDatos(fec_inicio, fec_final);
        let modelarAnio = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        horas_extras.forEach((obj) => {
            let fecha = parseInt(obj.fecha.split('-')[1]);
            // console.log(fecha.getMonth());
            switch (fecha) {
                case 1:
                    modelarAnio.enero.push(obj.tiempo);
                    break;
                case 2:
                    modelarAnio.febrero.push(obj.tiempo);
                    break;
                case 3:
                    modelarAnio.marzo.push(obj.tiempo);
                    break;
                case 4:
                    modelarAnio.abril.push(obj.tiempo);
                    break;
                case 5:
                    modelarAnio.mayo.push(obj.tiempo);
                    break;
                case 6:
                    modelarAnio.junio.push(obj.tiempo);
                    break;
                case 7:
                    modelarAnio.julio.push(obj.tiempo);
                    break;
                case 8:
                    modelarAnio.agosto.push(obj.tiempo);
                    break;
                case 9:
                    modelarAnio.septiembre.push(obj.tiempo);
                    break;
                case 10:
                    modelarAnio.octubre.push(obj.tiempo);
                    break;
                case 11:
                    modelarAnio.noviembre.push(obj.tiempo);
                    break;
                case 12:
                    modelarAnio.diciembre.push(obj.tiempo);
                    break;
                default: break;
            }
        });
        horas_extras = [];
        let data = [
            { id: 0, mes: 'Enero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.enero) },
            { id: 1, mes: 'Febrero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.febrero) },
            { id: 2, mes: 'Marzo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.marzo) },
            { id: 3, mes: 'Abril', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.abril) },
            { id: 4, mes: 'Mayo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.mayo) },
            { id: 5, mes: 'Junio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.junio) },
            { id: 6, mes: 'Julio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.julio) },
            { id: 7, mes: 'Agosto', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.agosto) },
            { id: 8, mes: 'Septiembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.septiembre) },
            { id: 9, mes: 'Octubre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.octubre) },
            { id: 10, mes: 'Noviembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.noviembre) },
            { id: 11, mes: 'Diciembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnio.diciembre) }
        ];
        let meses = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.mes; });
        let valor_mensual_hora_extra = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        /**
         * Para tiempo de joranda
         */
        let timbres = yield SubMetodosGraficas_1.BuscarTimbresEoSModelado(fec_inicio.toJSON().split('T')[0], fec_final.toJSON().split('T')[0]);
        let nuevo = timbres.filter(obj => {
            return obj.horario.length != 0;
        }).map(obj => {
            obj.horario.forEach(ele => {
                ele.hora = SubMetodosGraficas_1.HHMMtoHorasDecimal(ele.hora);
            });
            return obj;
        });
        let modelarAnioTiempoJornada = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        timbres = [];
        nuevo.forEach(obj => {
            obj.timbres.forEach((ele) => {
                ele.registros.forEach((obj1) => {
                    if (obj.horario[0].hora < obj1.fec_hora_timbre) {
                        obj.respuesta.push({
                            fecha: ele.fecha,
                            total: obj1.fec_hora_timbre - obj.horario[0].hora
                        });
                    }
                });
            });
        });
        nuevo.forEach(ele => {
            ele.respuesta.forEach(obj => {
                let fecha = parseInt(obj.fecha.split('-')[1]);
                // console.log(fecha.getMonth());
                switch (fecha) {
                    case 1:
                        modelarAnioTiempoJornada.enero.push(obj.total);
                        break;
                    case 2:
                        modelarAnioTiempoJornada.febrero.push(obj.total);
                        break;
                    case 3:
                        modelarAnioTiempoJornada.marzo.push(obj.total);
                        break;
                    case 4:
                        modelarAnioTiempoJornada.abril.push(obj.total);
                        break;
                    case 5:
                        modelarAnioTiempoJornada.mayo.push(obj.total);
                        break;
                    case 6:
                        modelarAnioTiempoJornada.junio.push(obj.total);
                        break;
                    case 7:
                        modelarAnioTiempoJornada.julio.push(obj.total);
                        break;
                    case 8:
                        modelarAnioTiempoJornada.agosto.push(obj.total);
                        break;
                    case 9:
                        modelarAnioTiempoJornada.septiembre.push(obj.total);
                        break;
                    case 10:
                        modelarAnioTiempoJornada.octubre.push(obj.total);
                        break;
                    case 11:
                        modelarAnioTiempoJornada.noviembre.push(obj.total);
                        break;
                    case 12:
                        modelarAnioTiempoJornada.diciembre.push(obj.total);
                        break;
                    default: break;
                }
            });
        });
        let data_tiempo_jornada = [
            { id: 0, mes: 'Enero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.enero) },
            { id: 1, mes: 'Febrero', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.febrero) },
            { id: 2, mes: 'Marzo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.marzo) },
            { id: 3, mes: 'Abril', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.abril) },
            { id: 4, mes: 'Mayo', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.mayo) },
            { id: 5, mes: 'Junio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.junio) },
            { id: 6, mes: 'Julio', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.julio) },
            { id: 7, mes: 'Agosto', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.agosto) },
            { id: 8, mes: 'Septiembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.septiembre) },
            { id: 9, mes: 'Octubre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.octubre) },
            { id: 10, mes: 'Noviembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.noviembre) },
            { id: 11, mes: 'Diciembre', valor: SubMetodosGraficas_1.SumarValoresArray(modelarAnioTiempoJornada.diciembre) }
        ];
        let valor_mensual_tiempo = data_tiempo_jornada.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        return {
            color: ['#003366', '#006699', '#4cabce', '#e5323e'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: { data: ['Tiempo Jornada', 'Horas Extras'] },
            xAxis: [
                {
                    name: 'Meses',
                    type: 'category',
                    axisTick: { show: false },
                    data: meses
                }
            ],
            yAxis: [{ type: 'value', name: 'N° horas' }],
            series: [
                {
                    name: 'Tiempo Jornada',
                    type: 'bar',
                    barGap: 0,
                    data: valor_mensual_tiempo
                },
                {
                    name: 'Horas Extras',
                    type: 'bar',
                    data: valor_mensual_hora_extra
                }
            ]
        };
    });
};
exports.GraficaMarcaciones = function (id_empresa, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empresa, fec_inicio, fec_final);
        let timbres = yield SubMetodosGraficas_1.BuscarTimbresByFecha(fec_inicio.toJSON().split('T')[0], fec_final.toJSON().split('T')[0]);
        // console.log('==========================================');
        // console.log(timbres);
        // console.log('==========================================');
        let modelarAnio = {
            enero: [],
            febrero: [],
            marzo: [],
            abril: [],
            mayo: [],
            junio: [],
            julio: [],
            agosto: [],
            septiembre: [],
            octubre: [],
            noviembre: [],
            diciembre: []
        };
        timbres.forEach(obj => {
            let fecha = obj.fec_hora_timbre;
            // console.log(fecha.getMonth());
            switch (fecha.getMonth()) {
                case 0:
                    modelarAnio.enero.push(fecha);
                    break;
                case 1:
                    modelarAnio.febrero.push(fecha);
                    break;
                case 2:
                    modelarAnio.marzo.push(fecha);
                    break;
                case 3:
                    modelarAnio.abril.push(fecha);
                    break;
                case 4:
                    modelarAnio.mayo.push(fecha);
                    break;
                case 5:
                    modelarAnio.junio.push(fecha);
                    break;
                case 6:
                    modelarAnio.julio.push(fecha);
                    break;
                case 7:
                    modelarAnio.agosto.push(fecha);
                    break;
                case 8:
                    modelarAnio.septiembre.push(fecha);
                    break;
                case 9:
                    modelarAnio.octubre.push(fecha);
                    break;
                case 10:
                    modelarAnio.noviembre.push(fecha);
                    break;
                case 11:
                    modelarAnio.diciembre.push(fecha);
                    break;
                default: break;
            }
        });
        // console.log(modelarAnio);
        timbres = [];
        let data = [
            { id: 0, mes: 'Enero', valor: modelarAnio.enero.length },
            { id: 1, mes: 'Febrero', valor: modelarAnio.febrero.length },
            { id: 2, mes: 'Marzo', valor: modelarAnio.marzo.length },
            { id: 3, mes: 'Abril', valor: modelarAnio.abril.length },
            { id: 4, mes: 'Mayo', valor: modelarAnio.mayo.length },
            { id: 5, mes: 'Junio', valor: modelarAnio.junio.length },
            { id: 6, mes: 'Julio', valor: modelarAnio.julio.length },
            { id: 7, mes: 'Agosto', valor: modelarAnio.agosto.length },
            { id: 8, mes: 'Septiembre', valor: modelarAnio.septiembre.length },
            { id: 9, mes: 'Octubre', valor: modelarAnio.octubre.length },
            { id: 10, mes: 'Noviembre', valor: modelarAnio.noviembre.length },
            { id: 11, mes: 'Diciembre', valor: modelarAnio.diciembre.length }
        ];
        let meses = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.mes; });
        let valor_mensual = data.filter(obj => { return (obj.id >= fec_inicio.getUTCMonth() && obj.id <= fec_final.getUTCMonth()); }).map(obj => { return obj.valor; });
        return {
            baseOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'line', label: { backgroundColor: '#6a7985' } }
                },
                legend: { align: 'left', data: [{ name: 'marcaciones' }] },
                grid: { left: '4%', containLabel: true },
                xAxis: { type: 'category', name: 'Meses', data: meses },
                yAxis: { type: 'value', name: 'N° Timbres' },
                series: [{
                        name: 'marcaciones',
                        data: valor_mensual,
                        type: 'line',
                        lineStyle: { color: 'rgb(20, 112, 233)' },
                        itemStyle: { color: 'rgb(20, 112, 233)' }
                    }],
            },
            media: [
                {
                    query: {
                        minWidth: 200,
                        maxHeight: 300,
                        minAspectRatio: 1.3 // when length-to-width ratio is less than 1
                    },
                    option: {
                        legend: {
                            right: 'center',
                            bottom: 0,
                            orient: 'horizontal' // horizontal layout of legend
                        },
                    }
                }
            ]
        };
    });
};
function IdsEmpleados(id_empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default.query('SELECT distinct co.id_empleado FROM sucursales AS s, cg_departamentos AS d, empl_cargos AS ca, empl_contratos AS co, empleados AS e WHERE s.id_empresa = $1 AND s.id = d.id_sucursal AND ca.id_sucursal = s.id AND d.id = ca.id_departamento AND co.id = ca.id_empl_contrato AND e.id = co.id_empleado AND e.estado = 1 ORDER BY e.apellido ASC', [id_empresa])
            .then(result => {
            return result.rows;
        });
    });
}
/**
 *
 * Graficas para los usuarios de rol empleado
 *
 */
exports.MetricaHorasExtraEmpleado = function (id_empleado, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empleado, fec_inicio, fec_final);
        // let ids = await IdsEmpleados(id_empresa);
        return {
            baseOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: { backgroundColor: '#6a7985' }
                    }
                },
                legend: {
                    align: 'left',
                    data: [{
                            name: 'hora extra'
                        }]
                },
                grid: {
                    left: '4%',
                    right: '4%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    // data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                    data: ['Enero']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        name: 'hora extra',
                        // data: [30, 40, 35, 46, 27, 49, 15, 21, 32, 44, 10, 20],
                        data: [1],
                        type: 'line',
                        lineStyle: { color: 'rgb(20, 112, 233)' },
                        itemStyle: { color: 'rgb(20, 112, 233)' }
                    }],
            },
            media: [
                {
                    query: {
                        minWidth: 200,
                        maxHeight: 300,
                        minAspectRatio: 1.3 // when length-to-width ratio is less than 1
                    },
                    option: {
                        legend: {
                            right: 'center',
                            bottom: 0,
                            orient: 'horizontal' // horizontal layout of legend
                        },
                    }
                }
            ]
        };
    });
};
exports.MetricaVacacionesEmpleado = function (id_empleado, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empleado, fec_inicio, fec_final);
        // let ids = await IdsEmpleados(id_empresa);
        return {
            baseOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: { backgroundColor: '#6a7985' }
                    }
                },
                legend: {
                    align: 'left',
                    data: [{
                            name: 'vacaciones'
                        }]
                },
                grid: {
                    left: '4%',
                    right: '4%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    // data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                    data: ['Enero']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        name: 'vacaciones',
                        // data: [30, 40, 35, 46, 27, 49, 15, 21, 32, 44, 10, 20],
                        data: [3],
                        type: 'line',
                        lineStyle: { color: 'rgb(20, 112, 233)' },
                        itemStyle: { color: 'rgb(20, 112, 233)' }
                    }],
            },
            media: [
                {
                    query: {
                        minWidth: 200,
                        maxHeight: 300,
                        minAspectRatio: 1.3 // when length-to-width ratio is less than 1
                    },
                    option: {
                        legend: {
                            right: 'center',
                            bottom: 0,
                            orient: 'horizontal' // horizontal layout of legend
                        },
                    }
                }
            ]
        };
    });
};
exports.MetricaPermisosEmpleado = function (id_empleado, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empleado, fec_inicio, fec_final);
        // let ids = await IdsEmpleados(id_empresa);
        return {
            baseOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: { backgroundColor: '#6a7985' }
                    }
                },
                legend: {
                    align: 'left',
                    data: [{
                            name: 'hora extra'
                        }]
                },
                grid: {
                    left: '4%',
                    right: '4%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    // data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                    data: ['Enero', 'Febrero']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        name: 'hora extra',
                        // data: [30, 40, 35, 46, 27, 49, 15, 21, 32, 44, 10, 20],
                        data: [33, 10],
                        type: 'line',
                        lineStyle: { color: 'rgb(20, 112, 233)' },
                        itemStyle: { color: 'rgb(20, 112, 233)' }
                    }],
            },
            media: [
                {
                    query: {
                        minWidth: 200,
                        maxHeight: 300,
                        minAspectRatio: 1.3 // when length-to-width ratio is less than 1
                    },
                    option: {
                        legend: {
                            right: 'center',
                            bottom: 0,
                            orient: 'horizontal' // horizontal layout of legend
                        },
                    }
                }
            ]
        };
    });
};
exports.MetricaAtrasosEmpleado = function (id_empleado, fec_inicio, fec_final) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empleado, fec_inicio, fec_final);
        // let ids = await IdsEmpleados(id_empresa);
        return {
            baseOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: { backgroundColor: '#6a7985' }
                    }
                },
                legend: {
                    align: 'left',
                    data: [{
                            name: 'hora extra'
                        }]
                },
                grid: {
                    left: '4%',
                    right: '4%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    // data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                    data: ['Enero', 'Febrero']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        name: 'hora extra',
                        // data: [30, 40, 35, 46, 27, 49, 15, 21, 32, 44, 10, 20],
                        data: [33, 10],
                        type: 'line',
                        lineStyle: { color: 'rgb(20, 112, 233)' },
                        itemStyle: { color: 'rgb(20, 112, 233)' }
                    }],
            },
            media: [
                {
                    query: {
                        minWidth: 200,
                        maxHeight: 300,
                        minAspectRatio: 1.3 // when length-to-width ratio is less than 1
                    },
                    option: {
                        legend: {
                            right: 'center',
                            bottom: 0,
                            orient: 'horizontal' // horizontal layout of legend
                        },
                    }
                }
            ]
        };
    });
};
