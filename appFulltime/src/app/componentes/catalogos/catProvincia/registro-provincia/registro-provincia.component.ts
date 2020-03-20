import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';

interface opcionesPais {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-registro-provincia',
  templateUrl: './registro-provincia.component.html',
  styleUrls: ['./registro-provincia.component.css']
})

export class RegistroProvinciaComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombrePaisF = new FormControl('', [Validators.required]);
  nombreProvinciaF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);

  // Asignación de validaciones a inputs del formulario
  public NuevaProvinciasForm = new FormGroup({
    nombrePaisForm: this.nombrePaisF,
    nombreProvinciaForm: this.nombreProvinciaF,
  });

  // Arreglo de paises existentes
  paises: opcionesPais[] = [
    { valor: 'Ecuador', nombre: 'Ecuador' },
    { valor: 'Colombia', nombre: 'Colombia' },
    { valor: 'Venezuela', nombre: 'Venezuela' },
    { valor: 'Perú', nombre: 'Perú' },
  ];
  seleccionarPais: string = this.paises[0].valor;

  constructor(
    private rest: ProvinciaService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroProvinciaComponent>,
  ) { }

  ngOnInit(): void {
  }

  ObtenerMensajePaisRequerido() {
    if (this.nombrePaisF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

  ObtenerMensajeProvinciaRequerido() {
    if (this.nombreProvinciaF.hasError('required')) {
      return 'Campo Obligatorio';
    }
    return this.nombreProvinciaF.hasError('pattern') ? 'Ingrese un nombre válido' : '';
  }

  InsertarProvincia(form) {
    let dataProvincia = {
      pais: form.nombrePaisForm,
      nombre: form.nombreProvinciaForm,
    };
    this.rest.postProvinciaRest(dataProvincia).subscribe(response => {
      this.toastr.success('Operacion Exitosa', 'Provincia guardada');
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Provincia no pudo ser registrada')
    });;
  }

  LimpiarCampos() {
    this.NuevaProvinciasForm.reset();
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

  CerrarVentanaRegistroProvincia() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }
}
