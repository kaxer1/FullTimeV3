import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sucCiudad'
})
export class SucCiudadPipe implements PipeTransform {

  transform(value: any, arg: any): any {

    if(arg === undefined || arg === null || arg.length < 2 ) return value;

    const resultadoSucursal = [];

    for(const sucursal of value){
      if(sucursal.ciudad.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultadoSucursal.push(sucursal);
      };
    };
    return resultadoSucursal;
  }

}
