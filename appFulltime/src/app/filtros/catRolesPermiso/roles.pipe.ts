import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roles'
})
export class RolesPipe implements PipeTransform {

  transform(value: any, arg: any): any {

    if(arg === '' || arg === null || arg.length < 2 ) return value;

    const resultadoRol = [];

    for(const rol of value){
      if(rol.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultadoRol.push(rol);
      };
    };
    return resultadoRol;
  }

}
