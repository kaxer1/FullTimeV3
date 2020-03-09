import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {FeriadosService } from 'src/app/servicios/catalogos/feriados/feriados.service';
import { RelojesComponent } from 'src/app/componentes/catalogos/relojes/relojes.component';

@Component({
  selector: 'app-feriados',
  templateUrl: './feriados.component.html',
  styleUrls: ['./feriados.component.css']
})
export class FeriadosComponent implements OnInit {

    // Control de campos y validaciones del formulario
    fechaF = new FormControl('', Validators.required);
    descripcionF = new FormControl('', [Validators.required]);
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
    public ventana: MatDialog
  ) { }

  ngOnInit(): void {
  }

  InsertarFeriado(form) {
    let datosFeriado = {
      fecha: form.fechaForm,
      descripcion: form.descripcionForm,
      fec_recuperacion: form.fechaRecuperacionForm
    };

    this.rest.CrearNuevoFeriado(datosFeriado).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Feriado registrado')
      this.LimpiarCampos();
    }, error => {
      this.toastr.error('Operación Fallida', 'Feriado no se pudo registrar')

    });
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.descripcionF.hasError('required')) {
      return 'Debe ingresar un nombre';
    }
  }

  ObtenerMensajeErrorFechaRequerida() {
    if (this.fechaF.hasError('required')) {
      return 'Debe ingresar una fecha';
    }
  }

  LimpiarCampos() {
    this.FeriadosForm.reset();
  }

  abrirVentana(): void {
this.ventana.open(RelojesComponent, {width:'300px'})
  }

}
