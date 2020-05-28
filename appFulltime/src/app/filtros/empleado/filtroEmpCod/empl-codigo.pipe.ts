import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emplCodigo'
})
export class EmplCodigoPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (arg === '' || arg === undefined || arg.length < 1) return value;
    const RESULTADO_BUSQUEDAS = [];
    for (const resultados of value) {
      if (resultados.id && resultados.id == arg) {
        RESULTADO_BUSQUEDAS.push(resultados);
      }
    };
    return RESULTADO_BUSQUEDAS;
  }

}
