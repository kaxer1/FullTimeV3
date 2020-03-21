import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroFecha'
})
export class FiltroFechaPipe implements PipeTransform {

  transform(value: any, filtroFecha: any): any {
    if (filtroFecha === '' || filtroFecha.length < 2) return value;
    const RESULTADO_FERIADOS = [];
    for (const feriados of value) {
      if (feriados.fecha && feriados.fecha.toLowerCase().indexOf(filtroFecha.toLowerCase()) > -1) {
        RESULTADO_FERIADOS.push(feriados);
      }
    };
    return RESULTADO_FERIADOS;
  }

}
