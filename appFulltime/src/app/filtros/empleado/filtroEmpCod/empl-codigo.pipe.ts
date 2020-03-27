import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emplCodigo'
})
export class EmplCodigoPipe implements PipeTransform {

  transform(value: any, arg: number): any {

    if(arg === null || arg === undefined) return value;

    const resultadoEmpleado = [];

    for(const empleado of value){
      if(empleado.id == arg){
        resultadoEmpleado.push(empleado);
      };
    };
    return resultadoEmpleado;
  }

}
