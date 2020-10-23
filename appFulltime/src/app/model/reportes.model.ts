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