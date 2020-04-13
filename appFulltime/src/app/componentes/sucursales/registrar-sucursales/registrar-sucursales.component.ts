import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service'
import { MatDialogRef } from '@angular/material/dialog';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';

@Component({
  selector: 'app-registrar-sucursales',
  templateUrl: './registrar-sucursales.component.html',
  styleUrls: ['./registrar-sucursales.component.css']
})
export class RegistrarSucursalesComponent implements OnInit {

  nombre = new FormControl('',[Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]  );
  idCiudad = new FormControl('',[Validators.required]);

  ciudades: any = [];

  public nuevaSucursalForm = new FormGroup({
    sucursalNombreForm: this.nombre,
    idCiudadForm: this.idCiudad,
  });
  
  constructor(
    public restCiudad: CiudadService,
    public restSucursal: SucursalService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarSucursalesComponent>,
  ) { }

  ngOnInit(): void {
    this.obtenerCiudades();
  }

  obtenerCiudades(){
    this.ciudades = [];
    this.restCiudad.ConsultarCiudades().subscribe(datos => {
      this.ciudades = datos;
    })
  }

  InsertarSucursal(form) {
    let dataSucursal = {
      nombre: form.sucursalNombreForm,
      id_ciudad: form.idCiudadForm,
    };
    this.restSucursal.postSucursalRest(dataSucursal).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Sucursal guardada');
      this.LimpiarCampos();
    }, error => {
    });;
  }

  LimpiarCampos() {
    this.nuevaSucursalForm.reset();
  }

  CerrarVentanaRegistroSucursal() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
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

  ObtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo Obligatorio';
    }
    return this.nombre.hasError('pattern') ? 'Ingrese un nombre válido' : '';
  }

}
