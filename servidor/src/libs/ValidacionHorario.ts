import pool from '../database'

function sumaDias(fecha: Date, dias: number) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

function restaDias(fecha: Date, dias: number) {
    fecha.setUTCHours(fecha.getHours());
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}

function ObtenerRangoSemanal(fHoy: Date) {

    fHoy.setUTCHours(0);
    fHoy.setUTCMinutes(0);
    
    var fechaInicio = new Date(fHoy); 
    var fechaFinal = new Date(fHoy); 
    let dia_suma = sumaDias(fechaFinal, 6 - fHoy.getDay())
    let dia_resta = restaDias(fechaInicio, fHoy.getDay())

    return {
        inicio: dia_resta,
        final: dia_suma
    }             
}

async function HorarioEmpleado(id_cargo: number, dia_inicia_semana: string): Promise<any> {
    return await pool.query('SELECT lunes, martes, miercoles, jueves, viernes, sabado, domingo FROM empl_horarios WHERE id_empl_cargo = $1 AND CAST(fec_inicio AS VARCHAR) like $2 || \'%\' ORDER BY fec_inicio ASC', [id_cargo, dia_inicia_semana])
    .then(result => {
        return result.rows
    }) 
}

export const ValidarHorarioEmpleado = async function(id_empleado: number, id_cargo: number) {
    var f = new Date();
    f.setHours(0)
    let diaInicioSemana = ObtenerRangoSemanal(f)
    let fechaIterada = new Date(diaInicioSemana.inicio);
    let diasLabora: any = await HorarioEmpleado(id_cargo, diaInicioSemana.inicio.toJSON().split('T')[0])
    let respuesta: any = [];
    let dataEstructurada: any = [];
    diasLabora.forEach((obj: any) => {
        let con = 0;
        for (let i = diaInicioSemana.inicio.getDate(); i <= diaInicioSemana.final.getDate(); i++) {
            fechaIterada.setDate(i)
            if (con === 0) {
                respuesta.push(obj.lunes)
            } else if (con === 1) {
                respuesta.push(obj.martes)
            } else if (con === 2) {
                respuesta.push(obj.miercoles)
            } else if (con === 3) {
                respuesta.push(obj.jueves)
            } else if (con === 4) {
                respuesta.push(obj.viernes)
            } else if (con === 5) {
                respuesta.push(obj.sabado)
            } else if (con === 6) {
                respuesta.push(obj.domingo)
            } 
            dataEstructurada.push({
                fec_iterada: fechaIterada.toJSON().split('T')[0],
                boolena_fecha: respuesta[con]
            }) 
            con = con + 1;
        }
    });
    
    return dataEstructurada
}