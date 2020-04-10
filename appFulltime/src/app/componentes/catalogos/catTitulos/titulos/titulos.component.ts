import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

import { TituloService } from 'src/app/servicios/catalogos/titulo.service';

// Interface para creación de selección de niveles
interface Nivel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.css']
})
export class TitulosComponent implements OnInit {

  // Control de los campos del formulario
  nombre = new FormControl('',[Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]  );
  nivel = new FormControl('', Validators.required)

  // asignar los campos en un formulario en grupo
  public nuevoTituloForm = new FormGroup({
    tituloNombreForm: this.nombre,
    tituloNivelForm: this.nivel,
  });

  // Arreglo de niveles existentes
  niveles: Nivel[] = [
    { value: '1', viewValue: 'Educación Básica' },
    { value: '2', viewValue: 'Bachillerato' },
    { value: '3', viewValue: 'Certificados' },
    { value: '4', viewValue: 'Diplomas' },
    { value: '5', viewValue: 'Tercer Nivel' },
    { value: '6', viewValue: 'Postgrado' },
    { value: '7', viewValue: 'PHD' }
  ];

  constructor(
    private rest: TituloService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TitulosComponent>,
  ) {
  }

  ngOnInit(): void {
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

  InsertarTitulo(form) {
    let dataTitulo = {
      nombre: form.tituloNombreForm,
      nivel: form.tituloNivelForm,
    };
    this.rest.postTituloRest(dataTitulo).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Título guardado');
      this.LimpiarCampos();
    }, error => {
    });;
  }

  LimpiarCampos() {
    this.nuevoTituloForm.reset();
  }

  CerrarVentanaRegistroTitulo() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
