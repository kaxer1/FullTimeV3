import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-editar-detalle-cat-horario',
  templateUrl: './editar-detalle-cat-horario.component.html',
  styleUrls: ['./editar-detalle-cat-horario.component.css']
})
export class EditarDetalleCatHorarioComponent implements OnInit {

  ordenF = new FormControl('', [Validators.required]);
  accionF = new FormControl('', [Validators.required]);
  horaF = new FormControl('', [Validators.required]);
  minEsperaF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public DetalleHorarioForm = new FormGroup({
    ordenForm: this.ordenF,
    accionForm: this.accionF,
    horaForm: this.horaF,
    minEsperaForm: this.minEsperaF,
  });

  /**
   * Variables progress spinner
   */
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 10;
  habilitarprogress: boolean = false;
  
  constructor(
    public rest: DetalleCatHorariosService,
    public restH: HorarioService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarDetalleCatHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.CargarDatos();
  }

  ValidarMinEspera(form, datos) {
    if (form.minEsperaForm === '') {
      datos.minu_espera = 0;
    }
  }

  InsertarDetalleHorario(form) {
    this.habilitarprogress = true;
    let datosDetalleH = {
      orden: form.ordenForm,
      hora: form.horaForm,
      minu_espera: form.minEsperaForm,
      id_horario: this.data.id_horario,
      tipo_accion: form.accionForm,
      id: this.data.id
    };
    console.log(datosDetalleH);
    this.ValidarMinEspera(form, datosDetalleH);
    console.log(datosDetalleH);
    this.rest.ActualizarRegistro(datosDetalleH).subscribe(response => {
      this.habilitarprogress = false;
      this.toastr.success('Operación Exitosa', 'Detalle de Horario registrado', {
        timeOut: 6000,
      })
      this.CerrarVentanaDetalleHorario();
    }, error => {
    });
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

  LimpiarCampos() {
    this.DetalleHorarioForm.reset();
  }

  CerrarVentanaDetalleHorario() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  CargarDatos() {
    this.DetalleHorarioForm.patchValue({
      ordenForm: String(this.data.orden),
      accionForm: this.data.tipo_accion,
      horaForm: this.data.hora,
      minEsperaForm: this.data.minu_espera,
    })
    if (this.data.tipo_accion === 'Entrada') {
      this.DetalleHorarioForm.patchValue({
        accionForm: 'E',
      })
    }
    else if (this.data.tipo_accion === 'Salida') {
      this.DetalleHorarioForm.patchValue({
        accionForm: 'S',
      })
    }
    else if (this.data.tipo_accion === 'S.Almuerzo') {
      this.DetalleHorarioForm.patchValue({
        accionForm: 'S/A',
      })
    }
    else if (this.data.tipo_accion === 'E. Almuerzo') {
      this.DetalleHorarioForm.patchValue({
        accionForm: 'E/A',
      })
    }
  }

}
