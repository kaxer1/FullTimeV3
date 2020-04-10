import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padre'
})
export class PadrePipe implements PipeTransform {

  transform(value: any, arg: any): any {

    if( arg === '' || arg === null || arg.length < 2 ) return value;

    const resultadoProceso = [];

    for(const proceso of value){
      if(proceso.proc_padre.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultadoProceso.push(proceso);
      };
    };
    return resultadoProceso;
  }

}
