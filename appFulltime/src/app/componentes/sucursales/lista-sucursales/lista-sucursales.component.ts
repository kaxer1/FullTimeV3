import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { RegistrarSucursalesComponent } from '../registrar-sucursales/registrar-sucursales.component';
import { FormControl, Validators } from '@angular/forms';
import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service';

@Component({
  selector: 'app-lista-sucursales',
  templateUrl: './lista-sucursales.component.html',
  styleUrls: ['./lista-sucursales.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListaSucursalesComponent implements OnInit {

  buscarNombre = new FormControl('', Validators.required);
  buscarCiudad = new FormControl('', Validators.required);
  filtroNombreSuc = '';
  filtroCiudadSuc = '';

  sucursales: any = [];
  auxSuc: any = [];
  auxCiu: any = [];

  constructor(
    private rest: SucursalService,
    private restCiudad: CiudadService,
    private toastr: ToastrService,
    public vistaRegistrarSucursal: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerSucursal();
  }

  ObtenerSucursal(){
    this.rest.getSucursalesRest().subscribe(data => {
      this.auxSuc = data;

      this.auxSuc.forEach(obj => {

        this.restCiudad.getUnaCiudadRest(obj.id_ciudad).subscribe(data => {

          this.auxCiu = data;
          
          let dataSucursal = {
            id: obj.id,
            nombre: obj.nombre,
            ciudad: this.auxCiu[0].descripcion
          }

          this.sucursales.push(dataSucursal);
        })
      });
    });
  }

  AbrirVentanaRegistrarSucursal(){
    this.vistaRegistrarSucursal.open(RegistrarSucursalesComponent, { width: '300px' }).disableClose = true;
  }

  LimpiarCampoBuscar(){
    this.buscarNombre.reset();
    this.buscarCiudad.reset();
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
  }

}
