import pool from '../database';
import moment from 'moment';
import { VacacionesDiasCalendario, InfoLabora, IAcumulado } from '../class/periVacacion'


function DescuentoDiasHorMin(hora_trabaja: number, num_dia_vacaciones: any) {

    var dProporcional = parseFloat(num_dia_vacaciones) * (30 / 22);
    var d = parseInt(dProporcional.toString())
    var aux_h = (dProporcional - d) * (hora_trabaja / 1);
    var h = parseInt(aux_h.toString());
    var aux_m = (aux_h - h) * (60 / 1);
    var m = parseInt(aux_m.toString());

    return {
        dias: d,
        horas: h,
        min: m
    }
}

function SaldoDiasHorMin(hora_trabaja: number, num_dia_vacaciones: any) {
    var dProporcional = parseFloat(num_dia_vacaciones);
    var d = parseInt(dProporcional.toString())
    var aux_h = (dProporcional - d) * (hora_trabaja / 1);
    var h = parseInt(aux_h.toString());
    var aux_m = (aux_h - h) * (60 / 1);
    var m = parseInt(aux_m.toString());

    return {
        dias: d,
        horas: h,
        min: m
    }
}

function diasTotal(array: any, i: Date, f: Date) {
    var diasFaltante = array[i.getMonth()];
    var y = diasFaltante - i.getDate();
    var x = f.getDate() + y + 1; // mas 1 empezando del dia que toma vacaciones
    return x
}

function CalcularDiasVacacion(inicio: Date, final: Date) {

    if (final.getDate() > inicio.getDate() && final.getMonth() === inicio.getMonth() && final.getFullYear() === inicio.getFullYear()) {
        // console.log('Calulo normal');
        let numDias = final.getDate() - inicio.getDate();
        return numDias + 1;

    } else if (final.getDate() < inicio.getDate() && final.getMonth() > inicio.getMonth() && final.getFullYear() === inicio.getFullYear()) {

        if (((final.getFullYear() % 4 == 0) && (final.getFullYear() % 100 != 0)) || (final.getFullYear() % 400 == 0)) {
            // console.log('Este año es bisiesto', final.getFullYear());            
            var DiasCadaMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            return diasTotal(DiasCadaMes, inicio, final);
        } else {
            // console.log('No bisiesto');
            var DiasCadaMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            return diasTotal(DiasCadaMes, inicio, final);
        }

    } else if (final.getFullYear() > inicio.getFullYear()) {
        // console.log('Años diferentes');
        var DiasCadaMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        return diasTotal(DiasCadaMes, inicio, final);
    }

}

/**
 * 
 * @param contador Verifica la primera entrada
 * @param acumulado Acumulación de dias en la primera entrada, luego en las siguientes entradas es la acumulación del saldo anterior 
 * @param descuen son el número de dias de la solicitud de vacaciones * (30/22)
 */
function CarcularSaldoDecimal(contador: number, acumulado: number, descuen: any) {

    if (contador === 0) {
        let x = acumulado - descuen
        // console.log(acumulado);
        // console.log('saldo Decimal',x);
        // console.log("================");
        return x
    } else {
        let x = acumulado - descuen
        // console.log(acumulado);
        // console.log('saldo Decimal',x);
        // console.log("================");
        return x
    }

}

// falta mejorar este metodo en caso de usarlo
function CalcularDiasAcumulados(dias_obliga: number, I_Periodo: Date, F_Periodo: Date) {

    var f = new Date();
    var fecha1 = moment(I_Periodo.toJSON().split("T")[0]);
    var fecha2 = moment(F_Periodo.toJSON().split("T")[0]);

    if (f.getFullYear() != F_Periodo.getFullYear() && f.getFullYear() != I_Periodo.getFullYear()) {
        var diasLaborados = fecha2.diff(fecha1, 'days');
        var aux = (diasLaborados * 15) / 365
        return 15
    } else {
        var fechaAux = moment(f.toJSON().split("T")[0]);
        var diasLaborados = fechaAux.diff(fecha1, 'days');
        var aux = (diasLaborados * 15) / 365
        return aux
    }

}

async function ObtenerPeriodosEmpleado(id_empl: number, diasObliga: any, fec_final_Rango: string, hora_trabaja: number) {
    
    let primerPeriodoInicio = await pool.query('SELECT pv.fec_inicio FROM empl_contratos e, peri_vacaciones pv WHERE e.id_empleado = $1 AND e.id = pv.id_empl_contrato AND pv.estado = 1 ORDER BY e.fec_ingreso DESC, pv.fec_inicio LIMIT 1', [id_empl])
                .then(result => {
                    return result.rows[0].fec_inicio.toJSON().split('T')[0];
                });
    
    let arrayPeriodos = await pool.query('SELECT pv.id as id_peri_vac, pv.fec_inicio, pv.fec_final, pv.dia_vacacion, pv.horas_vacaciones, pv.min_vacaciones, pv.dia_antiguedad FROM empl_contratos e, peri_vacaciones pv WHERE e.id_empleado = $1 AND pv.estado = 1 AND e.id = pv.id_empl_contrato AND CAST(pv.fec_final as VARCHAR) between $2 || \'%\' AND $3 || \'%\' ORDER BY e.fec_ingreso DESC, pv.fec_inicio', [id_empl, primerPeriodoInicio, fec_final_Rango])
                .then(result => {
                    return result.rows;
                });
    // console.log(arrayPeriodos);
    let acumulado = arrayPeriodos.map(obj => {
        // return CalcularDiasAcumulados(diasObliga.dia_obli, obj.fec_inicio, obj.fec_final)
        return DiasHorMinToDecimal(obj.dia_vacacion, obj.horas_vacaciones, obj.min_vacaciones, hora_trabaja)
    });
    console.log(acumulado);
    let valorAcumulado = 0;
    acumulado.forEach(obj => {
        valorAcumulado = obj + valorAcumulado
    })
    // console.log(valorAcumulado);
    let Inicio_Ultimo_Periodo = arrayPeriodos.map(obj => {
        return obj.fec_inicio;
    });
    // console.log('Inicio Periodos ====> ',Inicio_Ultimo_Periodo);
    let aniosInicio = arrayPeriodos.map(obj => {
        return obj.fec_inicio.getFullYear();
    });
    let aniosFinal = arrayPeriodos.map(obj => {
        return obj.fec_final.getFullYear();
    });

    var nuevo = [...new Set(aniosInicio.concat(aniosFinal))];  
    // console.log(nuevo);
    let aniosLaborados = nuevo[nuevo.length - 1] - nuevo[0];
    let obj_antiguedad = ObtenerDiasAdicionales(aniosLaborados) as InfoLabora; // APLICA SOLO A CODIGO DE TRABAJO
    
    return {
        fecha_ingreso: Inicio_Ultimo_Periodo[0], 
        acumulado: valorAcumulado,
        anios_labo: obj_antiguedad.anio,
        dia_adicional: obj_antiguedad.adicional,
        inicio_Ultimo_Periodo: Inicio_Ultimo_Periodo[Inicio_Ultimo_Periodo.length - 1]
    } as IAcumulado
}

function ObtenerDiasAdicionales(aniosLaborados: number) {
    let objeto: any = [
        { anio: 5, adicional: 0 },
        { anio: 6, adicional: 1 },
        { anio: 7, adicional: 2 },
        { anio: 8, adicional: 3 },
        { anio: 9, adicional: 4 },
        { anio: 10, adicional: 5 },
        { anio: 11, adicional: 6 },
        { anio: 12, adicional: 7 },
        { anio: 13, adicional: 8 },
        { anio: 14, adicional: 9 },
        { anio: 15, adicional: 10 },
        { anio: 16, adicional: 11 },
        { anio: 17, adicional: 12 },
        { anio: 18, adicional: 13 },
        { anio: 19, adicional: 14 },
        { anio: 10, adicional: 15 },
    ]

    let resultado: InfoLabora;
    resultado = {
        anio: 0, adicional: 0
    }
    objeto.forEach((ele: any) => {
        if (aniosLaborados === ele.anio) {
            resultado = ele;
        }
    });

    return resultado
}

/**
 * Método para pedir el periodo del presente año hasta la fecha actual de solicitud
 * @param id_empl Id de empleado que solicita el cardex
 * @param ant Fecha del año anterior solo el año Ejm: 2015
 * @param pre Fecha del año presente solo el año Ejm: 2016
 */
async function PeriodoVacacionContrato(id_empl: number, ant: string, pre: string) {
    let data = await pool.query('SELECT e.id as id_contrato, pv.id as id_peri_vac, e.id_regimen, pv.fec_inicio, pv.fec_final, pv.dia_vacacion, pv.horas_vacaciones, pv.min_vacaciones, pv.dia_antiguedad FROM empl_contratos e, peri_vacaciones pv WHERE e.id_empleado = $1 AND pv.estado = 1 AND e.id = pv.id_empl_contrato AND CAST(pv.fec_inicio as VARCHAR) like $2 || \'%\' AND CAST(pv.fec_final as VARCHAR) like $3 || \'%\' ORDER BY e.fec_ingreso DESC', [id_empl, ant, pre])
                .then(result => {
                    return result.rows[0];
                });
    return data
}

/**
 * Método para obtener las vacaciones de un determinado perido con un rango de fechas
 * @param id_peri_vac Id del preriodo de vacaciones
 * @param fec_inicio Fecha inicio del periodo
 * @param fec_final Fecha finaliza el periodo
 */
async function Vacaciones (id_peri_vac: number, fec_inicio: Date, fec_final: Date) {
    let data = await pool.query('SELECT v.fec_inicio, v.fec_final, v.fec_ingreso, v.dia_libre, v.dia_laborable FROM vacaciones v WHERE v.id_peri_vacacion = $1 AND v.estado like \'Aceptado\' AND CAST(v.fec_inicio as VARCHAR) between $2 || \'%\' AND $3 || \'%\' ORDER BY v.fec_inicio ASC', [id_peri_vac, fec_inicio, fec_final])
                .then(result => {
                    return result.rows;
                });
    return data
}

/**
 * Método para obtener permisos de acuerdo a un periodo en especifico y un rango de fechas
 * @param id_peri_vac Id del periodo de vacaciones
 * @param fec_inicio Fecha de inicio del periodo
 * @param fec_final Fecha de finalizacion del periodo
 */
async function Permisos(id_peri_vac: number, fec_inicio: Date, fec_final: Date) {
    let data = await pool.query('SELECT p.descripcion, p.fec_inicio, p.fec_final, p.dia, p.dia_libre, p.hora_numero FROM permisos p WHERE p.id_peri_vacacion = $1  AND p.estado like \'Aceptado\' AND CAST(p.fec_final as VARCHAR) between $2 || \'%\' AND $3 || \'%\'', [id_peri_vac, fec_inicio, fec_final])
        .then(result => {
            return result.rows;
        });
    return data
}

/**
 * Método para obtener el sueldo y horas de trabajo de un empleado en especifico de acuerdo a su ultimo contrato y cargo.
 * @param id_empleado Id del empleado que solicita
 */
async function SueldoHorasTrabaja(id_empleado: number) {
    let data = await pool.query('SELECT ca.sueldo, ca.hora_trabaja FROM empl_contratos co, empl_cargos ca WHERE co.id_empleado = $1 AND co.id = ca.id_empl_contrato ORDER BY ca.fec_inicio DESC LIMIT 1', [id_empleado])
        .then(result => {
            return result.rows;
        });
    return data
}

/**
 * Método para obtener los dias obligatorios de vacación y el máximo de dias que puede acumular el empleado según el regimen laboral que usa.
 * @param id_regimen Id del regimen laboral 
 */
async function diasObligaByRegimen(id_regimen: number) {
    let data = await pool.query('SELECT dia_anio_vacacion, dia_libr_anio_vacacion, max_dia_acumulacion FROM cg_regimenes WHERE id = $1', [id_regimen])
        .then(result => {
            return result.rows[0];
        });
    var x = data.dia_anio_vacacion + data.dia_libr_anio_vacacion;
    return { dia_obli: x, max_acumulado: data.max_dia_acumulacion }
}

export const vacacionesByIdUser = async function(id_empleado: number, desde: string, hasta: string) {
    // busco ID del ultimo contrato y su regimen del usuario
    var f = new Date()
    var f_presente = new Date()
    f.setUTCHours(f.getHours());
    f_presente.setUTCHours(f_presente.getHours());
    
    const dataPeri = await PeriodoVacacionContrato(id_empleado, desde.split("-")[0], hasta.split("-")[0]); //LISTO
    // console.log(dataPeri);
    
    const diasObliga = await diasObligaByRegimen(dataPeri.id_regimen); //LISTO
    // console.log('REGIMEN ======>',diasObliga);
    
    const vacaciones = await Vacaciones(dataPeri.id_peri_vac, dataPeri.fec_inicio, dataPeri.fec_final); //LISTO
    // console.log('VACACIONES ##################',vacaciones);
    
    const permisos = await Permisos(dataPeri.id_peri_vac, dataPeri.fec_inicio, dataPeri.fec_final); //LISTO
    // console.log('PERMISOS ##################', permisos);

    const sueldoHora = await SueldoHorasTrabaja(id_empleado); //LISTO
    // console.log(sueldoHora)

    let hora_trabaja = sueldoHora[0].hora_trabaja;
    // console.log(dataPeri.fec_final.toJSON().split('T')[0]);
    
    const acumulado = await ObtenerPeriodosEmpleado(id_empleado, diasObliga, dataPeri.fec_final.toJSON().split('T')[0], hora_trabaja); //LISTO
    // console.log(acumulado);

    /* VALORES DE PRUEBA */
    // acumulado.acumulado = 40.91;
    // let hora_trabaja = 6;
    // const acumulado = { acumulado: 40.91, anios_labo: 6, dia_adicional: 1 } as IAcumulado;

    let nuevoArray = UnirVacacionesPermiso(vacaciones, permisos); //LISTO
    // console.log(nuevoArray);
    
    let arrayDetalleKardex = ArrayTotalDetalleKardex(nuevoArray, hora_trabaja, acumulado, id_empleado); //LISTO

    // ComprobarCalculo(hora_trabaja, 24, 3, 16);

    return arrayDetalleKardex;
}

async function ArrayTotalDetalleKardex(arrayTotal: any, hora_trabaja: number, IAcumulado: IAcumulado, id_empleado: number) {

    let arrayDetalleKardex: any = [];
    let arrayProporcional: any = {
        periodo: [],
        antiguedad: []
    };
    let arrayLiquidacion: any = [];

    let contador = 0;
    let saldoDecimal = 0;

    arrayTotal.forEach((obj: any) => {

        let dkardex = {
            periodo: '',
            detalle: '',
            desde: '',
            hasta: '',
            descuento: {
                dias: 0,
                horas: 0,
                min: 0
            },
            saldo: {
                dias: 0,
                horas: 0,
                min: 0
            }
        }

        dkardex.periodo = JSON.stringify(obj.fec_final).slice(1, 5);
        dkardex.detalle = obj.descripcion;
        dkardex.desde = JSON.stringify(obj.fec_inicio).slice(1, -1);
        dkardex.hasta = JSON.stringify(obj.fec_final).slice(1, -1);

        let num_dia_vacaciones = CalcularDiasVacacion(obj.fec_inicio, obj.fec_final) || 0;

        let descuen;
        let proporcional_descuento;

        if (num_dia_vacaciones === 0) {
            var hora = parseInt(obj.hora_numero.split(':')[0]);
            var min = parseInt(obj.hora_numero.split(':')[1]);
            var dia = (hora / hora_trabaja) + (min * (1 / 60) * (1 / hora_trabaja));
            proporcional_descuento = dia * (30 / 22)
            descuen = DescuentoDiasHorMin(hora_trabaja, dia);
        } else {
            proporcional_descuento = num_dia_vacaciones * (30 / 22)
            descuen = DescuentoDiasHorMin(hora_trabaja, num_dia_vacaciones);
        }

        let saldo = { dias: 0, horas: 0, min: 0 };

        if (contador === 0) {
            saldoDecimal = CarcularSaldoDecimal(contador, IAcumulado.acumulado, proporcional_descuento);
            saldo = SaldoDiasHorMin(hora_trabaja, saldoDecimal);
        } else {
            saldoDecimal = CarcularSaldoDecimal(contador, saldoDecimal, proporcional_descuento);
            saldo = SaldoDiasHorMin(hora_trabaja, saldoDecimal);
        }

        if (contador === arrayTotal.length - 1) { // recepta el ultimo saldo
            console.log(IAcumulado);
            let DPeriodo = DetallePeriodoMetodo(IAcumulado.inicio_Ultimo_Periodo);

            let DAntiguedad = DetalleAntiguedadMetodo(IAcumulado.dia_adicional);

            let DLiquidacion = DetalleLiquidacionMetodo(saldoDecimal, DPeriodo.valor, DAntiguedad.valor)
            console.log(DPeriodo);
            console.log(DAntiguedad);
            console.log(DLiquidacion);
            arrayProporcional.periodo.push(DPeriodo);
            arrayProporcional.antiguedad.push(DAntiguedad);
            arrayLiquidacion.push(DLiquidacion);

            console.log('===========');
            console.log(saldoDecimal);
        }

        contador = contador + 1;
        dkardex.descuento = descuen;
        dkardex.saldo = saldo;
        dkardex as VacacionesDiasCalendario;
        arrayDetalleKardex.push(dkardex);
    });

    // ObtenerInformacionEmpleado(IAcumulado, id_empleado)
    let empleado = await ObtenerInformacionEmpleado(IAcumulado, id_empleado);
    // console.log(empleado);

    let KardexJsop = {
        empleado: [empleado],
        detalle: arrayDetalleKardex,
        proporcional: arrayProporcional,
        liquidacion: arrayLiquidacion
    }
    return KardexJsop;
}

function UnirVacacionesPermiso(vacaciones: any, permisos: any) {

    let arrayUnico: any = [];

    vacaciones.forEach((element: any) => {
        element.fec_inicio.setUTCHours(0)
        element.fec_final.setUTCHours(0)
        let camposIguales = {
            fec_inicio: element.fec_inicio,
            fec_final: element.fec_final,
            descripcion: 'Solicitud Vacaciones',
            dia_laborable: element.dia_laborable,
            dia_libre: element.dia_libre,
            hora_numero: '00:00:00'
        }
        arrayUnico.push(camposIguales)
    });

    permisos.forEach((element: any) => {
        element.fec_inicio.setUTCHours(0)
        element.fec_final.setUTCHours(0)
        let camposIguales = {
            fec_inicio: element.fec_inicio,
            fec_final: element.fec_final,
            descripcion: 'Solicitud Permiso',
            // descripcion: element.descripcion,
            dia_laborable: element.dia,
            dia_libre: element.dia_libre,
            hora_numero: element.hora_numero
        }
        arrayUnico.push(camposIguales)
    });

    for (let j = 0; j < arrayUnico.length; j++) {
        let numMin;
        let i = numMin = j;
        for (++i; i < arrayUnico.length; i++) {
            (arrayUnico[i].fec_inicio < arrayUnico[numMin].fec_inicio) && (numMin = i);
        }
        [arrayUnico[j], arrayUnico[numMin]] = [arrayUnico[numMin], arrayUnico[j]]
    }

    return arrayUnico;
}

async function ObtenerInformacionEmpleado(IAcumulado: IAcumulado, id_empl: number) {
    let ObjetoEmpleado: any = {
        nombre: '',
        ciudad: '',
        cedula: '',
        codigo: '',
        fec_ingreso: IAcumulado.fecha_ingreso,
        fec_carga: IAcumulado.inicio_Ultimo_Periodo,
        acumulado: IAcumulado.acumulado,
        estado: 'Inactivo'
    }

    let data = await pool.query('SELECT e.nombre, e.apellido, e.cedula, e.codigo, e.estado, c.descripcion FROM empleados AS e, empl_contratos AS co, empl_cargos AS ca, sucursales AS s, ciudades AS c WHERE e.id = $1 AND e.id = co.id_empleado AND ca.id_empl_contrato = co.id AND s.id = ca.id_sucursal AND s.id_ciudad = c.id ORDER BY co.fec_ingreso DESC LIMIT 1', [id_empl])
            .then(result => {
                return result.rows[0];
            });
    ObjetoEmpleado.nombre = data.nombre + ' ' + data.apellido;
    ObjetoEmpleado.ciudad = data.descripcion;
    ObjetoEmpleado.cedula = data.cedula;
    ObjetoEmpleado.codigo = data.codigo;
    if (data.estado === 1) {
        ObjetoEmpleado.estado = 'Activo';
    }
    
    return ObjetoEmpleado
}

/**
 * Metodo para llenar el campo de Periodo en el Kardex
 * @param I_Periodo Fecha inicial del ultimo periodo 
 */
function DetallePeriodoMetodo(I_Periodo: Date) {
    var f = new Date();
    var aux_f = new Date(I_Periodo.toJSON().split('T')[0]);
    // console.log('ANTES ========================>',aux_f);
    aux_f.setFullYear(aux_f.getFullYear() + 1);
    // console.log('DESPUES ========================>',aux_f);
    let diasLaborados;
    let valor;
    if (f < aux_f) {
        // console.log('Periodo Actual');
        var fecha1 = moment(I_Periodo.toJSON().split("T")[0]);
        var fecha2 = moment(f.toJSON().split("T")[0]);
        diasLaborados = fecha2.diff(fecha1, 'days');
        valor = (diasLaborados * 15)/365
    } else {
        // console.log('Periodo Anterior');
        valor = 0;
    }

    let respuesta = TransformaDiasHorMin(valor);

    return respuesta
}

function DetalleAntiguedadMetodo(dia_adicional: number) {
    return TransformaDiasHorMin(dia_adicional);
}

/**
 * 
 * @param saldo 
 * @param periodo 
 * @param antiguedad 
 */
function DetalleLiquidacionMetodo(saldo: number, periodo: number, antiguedad: number) {
    return TransformaDiasHorMin(saldo + periodo + antiguedad)
}

function TransformaDiasHorMin(valor_decimal: any) {

    var d = parseInt(valor_decimal.toString().split(".")[0]);
    var aux_dia = valor_decimal - d;

    var aux_hor = aux_dia * 24;
    var h = parseInt(aux_hor.toString().split(".")[0]);

    var aux_min = (aux_hor - h) * 60;
    var m = parseInt(aux_min.toString().split(".")[0]);

    return {
        dias: d,
        horas: h,
        min: m,
        valor: valor_decimal
    }
}

function DiasHorMinToDecimal(dias: number, horas: number, min: number, hora_trabaja: number) {
    
    var hToD = horas/hora_trabaja;
    var mToD = min * (1/60)* (1/hora_trabaja)
    let decimal = dias + hToD + mToD
    return decimal
}

function ComprobarCalculo(hora_trabaja: number, dias: number, hora: number, min: number) {
    var h = hora / hora_trabaja;
    var m = (min / 60) * (1 / hora_trabaja)
    // console.log(dias + h + m);
    // console.log(dias + h + m + 10.5833);

    return dias + h + m;
}


/**
 * *****************************************************************************
 * METODO PARA LOS REPORTES DE PERIODO DE VACACIONES
 *  
 * *****************************************************************************
 */


export const ReportePeriVacaciones = async function(id_empleado: number) {

    console.log(id_empleado);
    
    return {message: 'Halgo a salido masl en el proceso'}
}
