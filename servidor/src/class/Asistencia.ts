export interface ITiempoLaboral{
    h_ingreso: Date,
    min_almuerzo: number,
    h_trabaja: number
}

export interface IAsistenciaDetalle  {
    fecha: string,
    fecha_mostrar: string
    E: {
        hora_default: string,
        hora_timbre: string,
        descripcion: string
    },
    S_A: {
        hora_default: string,
        hora_timbre: string,
        descripcion: string
    },
    E_A: {
        hora_default: string,
        hora_timbre: string,
        descripcion: string
    },
    S: {
        hora_default: string,
        hora_timbre: string,
        descripcion: string
    },
    atraso: string,
    sal_antes: string,
    almuerzo: string,
    hora_trab: string,
    hora_supl: string,
    hora_ex_L_V: string,
    hora_ex_S_D: string
}