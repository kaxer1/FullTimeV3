export interface IReporteEmpleados {
    cargo: boolean;
    cedula: boolean;
    codigo: boolean;
    depart: boolean;
    detall: boolean;
    grupo: boolean;
    nombre: boolean;
}

export interface IRestListEmpl {
    cedula: string;
    nom_completo: string;
    codigo?: string;
    departamento?: string;
    cargo?: string;
    grupo?: string;
    detalle_grupo?: string;
}

export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}

export interface IReporteAsistenciaConsolidada {
    atraso: boolean,
    salida_antes: boolean,
    almuerzo: boolean,
    h_trab: boolean,
    h_supl: boolean,
    h_ex_LV: boolean,
    h_ex_SD: boolean
}

export interface IRestAsisteConsoli {
    fecha_mostrar: string, 
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
    }
    atraso: string,
    sal_antes: string,
    almuerzo: string,
    hora_trab: string,
    hora_supl: string,
    hora_ex_L_V: string,
    hora_ex_S_D: string
}

export interface IRestTotalAsisteConsoli {
    atraso: string | number,
    sal_antes: string | number,
    almuerzo: string | number,
    hora_trab: string | number,
    hora_supl: string | number,
    hora_ex_L_V: string | number,
    hora_ex_S_D: string | number
}