import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timbreEmpleado'
})
export class TimbreEmpleadoPipe implements PipeTransform {

  transform(value: any, filtroEmpleado: any): any {
    if (filtroEmpleado === '' || filtroEmpleado.length < 2) return value;
    const RESULTADO_BUSQUEDAS = [];
    for (const resultados of value) {
      if (resultados.empleado && resultados.empleado.toLowerCase().indexOf(filtroEmpleado.toLowerCase()) > -1) {
        RESULTADO_BUSQUEDAS.push(resultados);
      }
    };
    return RESULTADO_BUSQUEDAS;
  }

}
