import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emplCedula'
})
export class EmplCedulaPipe implements PipeTransform {

  transform(value: any, arg: any): any {

    if(arg === undefined || arg === null || arg.length < 3 ) return value;

    const resultadoEmpleado = [];

    for(const empleado of value){
      if(empleado.cedula.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultadoEmpleado.push(empleado);
      };
    };
    return resultadoEmpleado;
  }

}
