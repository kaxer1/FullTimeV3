import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service';
import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';

@Component({
  selector: 'app-registrar-ciudad',
  templateUrl: './registrar-ciudad.component.html',
  styleUrls: ['./registrar-ciudad.component.css']
})
export class RegistrarCiudadComponent implements OnInit {

  // Control de los campos del formulario
  nombreF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  idProvinciaF = new FormControl('', [Validators.required]);

  // Datos Departamento
  ciudades: any = [];
  provinciaId: any = [];
  seleccionarProvincia;

  // Asignar los campos en un formulario en grupo
  public nuevaCiudadForm = new FormGroup({
    nombreForm: this.nombreF,
    idProvinciaForm: this.idProvinciaF,
  });

  constructor(
    private restP: ProvinciaService,
    private rest: CiudadService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarCiudadComponent>,
  ) { }

  ngOnInit(): void {
    this.ciudades = this.ObtenerProvincias();
  }

  InsertarCiudad(form) {
    var provinciaNombre = form.idProvinciaForm;
    var idP;
    if (provinciaNombre === 'Seleccionar') {
      this.toastr.info('Seleccione una provincia')
    }
    else {
      this.restP.getIdProvinciaRest(provinciaNombre).subscribe(datos => {
        this.provinciaId = datos;
        for (let i = this.provinciaId.length - 1; i >= 0; i--) {
          var id_Pro = this.provinciaId[i]['id'];
          idP = id_Pro;
        }
        let datosCiudad = {
          descripcion: form.nombreForm,
          id_provincia: idP,
        };
        this.rest.postCiudades(datosCiudad).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Ciudad registrada');
          this.LimpiarCampos();
        }, error => {
          this.toastr.error('Operación Fallida', 'Ciudad no pudo ser registrada')
        });
      }, (error) => {
        this.toastr.info('Descripción ingresada no coincide con los registros')
      })
    }
  }

  ObtenerProvincias() {
    this.ciudades = [];
    this.restP.getProvinciasRest().subscribe(datos => {
      this.ciudades = datos;
      this.ciudades[this.ciudades.length] = { nombre: "Seleccionar" };
      this.seleccionarProvincia = this.ciudades[this.ciudades.length - 1].nombre;
    })
  }

  LimpiarCampos() {
    this.nuevaCiudadForm.reset();
    this.ObtenerProvincias();
  }

  CerrarVentanaRegistroCiudad() {
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
    if (this.nombreF.hasError('required')) {
      return 'Campo obligatorio';
    }
    return this.nombreF.hasError('pattern') ? 'Ingresar un nombre válido' : '';
  }
}
