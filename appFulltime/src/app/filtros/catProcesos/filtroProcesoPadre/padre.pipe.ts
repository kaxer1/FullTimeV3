import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padre'
})
export class PadrePipe implements PipeTransform {

  transform(value: any, arg: number): any {

    if( arg === null || arg === undefined) return value;

    const resultadoProceso = [];

    for(const proceso of value){
      if(proceso.proc_padre == arg){
        resultadoProceso.push(proceso);
      };
    };
    return resultadoProceso;
  }

}
