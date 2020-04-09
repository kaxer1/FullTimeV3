import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { FeriadosService } from 'src/app/servicios/catalogos/catFeriados/feriados.service';

@Component({
  selector: 'app-registrar-feriados',
  templateUrl: './registrar-feriados.component.html',
  styleUrls: ['./registrar-feriados.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RegistrarFeriadosComponent implements OnInit {

  idUltimoFeriado: any = [];

  // Control de campos y validaciones del formulario
  fechaF = new FormControl('', Validators.required);
  descripcionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  fechaRecuperacionF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public FeriadosForm = new FormGroup({
    fechaForm: this.fechaF,
    descripcionForm: this.descripcionF,
    fechaRecuperacionForm: this.fechaRecuperacionF
  });

  constructor(
    private rest: FeriadosService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<RegistrarFeriadosComponent>,
  ) { }

  ngOnInit(): void {
  }

  InsertarFeriado(form) {
    let datosFeriado = {
      fecha: form.fechaForm,
      descripcion: form.descripcionForm,
      fec_recuperacion: form.fechaRecuperacionForm
    };
    if (datosFeriado.fec_recuperacion === '') {
      datosFeriado.fec_recuperacion = null;
    }
    this.rest.CrearNuevoFeriado(datosFeriado).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Feriado registrado')
      this.rest.ConsultarUltimoId().subscribe(response => {
        this.idUltimoFeriado = response;
        this.LimpiarCampos();
        this.dialogRef.close();
        this.router.navigate(['/verFeriados/', this.idUltimoFeriado[0].max]);
      }, error => { });
    }, error => {
      this.toastr.error('Operación Fallida', 'Feriado no se pudo registrar')
    });
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.descripcionF.hasError('required')) {
      return 'Campo Obligatorio';
    }
    return this.descripcionF.hasError('pattern') ? 'Ingrese un nombre válido' : '';
  }

  LimpiarCampos() {
    this.FeriadosForm.reset();
  }

  CerrarVentanaRegistroFeriado() {
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

}
