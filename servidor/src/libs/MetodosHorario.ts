import pool from '../database'
import moment from 'moment';
import {ObtenerRangoSemanal, ObtenerRangoMensual} from './MetodosFechas'

const FECHA_FERIADOS: any = [];

export const VerificarHorario = async function(id_cargo: number) {
    
    let horario = await pool.query('SELECT * FROM empl_horarios WHERE id_empl_cargo = $1 ORDER BY fec_inicio DESC LIMIT 1', [id_cargo]).then(result => { return result.rows[0]}); // devuelve el ultimo horario del cargo

    if (!horario) return {message: 'Horario no encontrado'}
    // console.log(horario);
    
    let respuesta = tipoHorario(horario.fec_inicio, horario.fec_final)
    var f = new Date();

    // FECHA_FERIADOS = feriados
    let feriados;
    
    let fechasRango;
    let objeto;
    if (respuesta === 'semanal') {
        fechasRango = ObtenerRangoSemanal(f);
        feriados = await pool.query('SELECT f.fecha FROM empl_cargos AS ca, sucursales AS s, ciudades AS c, ciud_feriados AS cf, cg_feriados AS f WHERE ca.id_sucursal = s.id AND c.id = s.id_ciudad AND c.id = cf.id_ciudad AND f.id = cf.id_feriado AND ca.id = $1 AND CAST(f.fecha AS VARCHAR) between $2 || \'%\' AND $3 || \'%\'',[id_cargo, fechasRango.inicio.toJSON().split('T')[0], fechasRango.final.toJSON().split('T')[0]]).then(result => { return result.rows});
        feriados.forEach(obj => {
            FECHA_FERIADOS.push(obj);
        })
        objeto = DiasByEstado(horario, fechasRango);
    } else if (respuesta === 'mensual') {
        fechasRango = ObtenerRangoMensual(f);
        objeto = DiasByEstado(horario, fechasRango);
    } else if (respuesta === 'anual') {
        fechasRango = ObtenerRangoMensual(f)
        objeto = DiasByEstado(horario, fechasRango);
    }
    // console.log('Fechas rango: ', fechasRango);
    // console.log('Objeto JSON: ', objeto);
    return objeto
}

/**
 * Metodo devuelve el tipo de horario que tiene el empleado.
 * @param inicio Fecha de inicio del horario del empleado.
 * @param final Fecha final del horario del empleado.
 */
function tipoHorario(inicio: Date, final: Date) {

    var fecha1 = moment(inicio.toJSON().split("T")[0]);
    var fecha2 = moment(final.toJSON().split("T")[0]);

    var diasHorario = fecha2.diff(fecha1, 'days');

    if (diasHorario >= 1 && diasHorario <= 7) return 'semanal'

    if (diasHorario >= 25 && diasHorario <= 35) return 'mensual'

    return 'anual'
    /**
     * semana = 6 (mayor a 1 menor a 7),
     * mensual (mayor a 25 y menor a 35)
     * anual = 365 (Hacer que sea mayor 40 y menor a 370)
     */    
}

/**
 * Metodo que devuelve el arreglo de las fechas con su estado.
 * @param horario Ultimo horario del empleado con los estados de los dias libres y normales
 * @param rango Fecha de inicio y final, puede ser rango semanal o mensual
 */
function DiasByEstado(horario: any, rango: any) {
    var fec_aux = new Date(rango.inicio)
    console.log(FECHA_FERIADOS);
    let respuesta = [];
    for (let i = fec_aux.getDate(); i <= rango.final.getDate(); i++) {
        let horario_res =  fechaIterada(fec_aux, horario);
        respuesta.push(horario_res)
        fec_aux.setDate(fec_aux.getDate() + 1)
    }
    return respuesta
}

/**
 * Método para devolver la fecha y el estado de cada uno de los dias de ese horario
 * @param fechaIterada Fecha asignada por el ciclo for 
 * @param horario es el ultimo horario del empleado.
 */
function fechaIterada(fechaIterada: Date, horario: any){
    let est;
    if (fechaIterada.getDay() === 0) {
        est = horario.domingo
    } else if (fechaIterada.getDay() === 1) {
        est = horario.lunes
    } else if (fechaIterada.getDay() === 2) {
        est = horario.martes
    } else if (fechaIterada.getDay() === 3) {
        est = horario.miercoles
    } else if (fechaIterada.getDay() === 4) {
        est = horario.jueves
    } else if (fechaIterada.getDay() === 5) {
        est = horario.viernes
    } else if (fechaIterada.getDay() === 6) {
        est = horario.sabado
    } 

    return {
        fecha: fechaIterada.toJSON().split('T')[0],
        estado: est
    }
}