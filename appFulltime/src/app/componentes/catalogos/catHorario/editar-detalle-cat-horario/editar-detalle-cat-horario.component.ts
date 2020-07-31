import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';

@Component({
  selector: 'app-editar-detalle-cat-horario',
  templateUrl: './editar-detalle-cat-horario.component.html',
  styleUrls: ['./editar-detalle-cat-horario.component.css']
})
export class EditarDetalleCatHorarioComponent implements OnInit {

  nocturno = false;

  ordenF = new FormControl('', [Validators.required]);
  accionF = new FormControl('', [Validators.required]);
  horaF = new FormControl('', [Validators.required]);
  minEsperaF = new FormControl('');
  tipoF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public DetalleHorarioForm = new FormGroup({
    ordenForm: this.ordenF,
    accionForm: this.accionF,
    horaForm: this.horaF,
    minEsperaForm: this.minEsperaF,
    tipoForm: this.tipoF
  });

  constructor(
    public rest: DetalleCatHorariosService,
    public restH: HorarioService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<EditarDetalleCatHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.CargarDatos();
  }

  ValidarMinEspera(form, datos) {
    if (form.minEsperaForm === '') {
      datos.minu_espera = '00:00';
    }
  }

  InsertarDetalleHorario(form) {
    let datosDetalleH = {
      orden: form.ordenForm,
      hora: form.horaForm,
      minu_espera: form.minEsperaForm,
      nocturno: form.tipoForm,
      id_horario: this.data.id_horario,
      tipo_accion: form.accionForm,
      id: this.data.id
    };
    console.log(datosDetalleH);
    this.ValidarMinEspera(form, datosDetalleH);
    console.log(datosDetalleH);
    this.rest.ActualizarRegistro(datosDetalleH).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Detalle de Horario registrado')
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
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
      tipoForm: this.data.nocturno
    })
    if (this.data.nocturno === true) {
      this.nocturno = true;
    }
    else {
      this.nocturno = false;
    }
    if (this.data.tipo_accion === 'Entrada') {
      this.DetalleHorarioForm.patchValue({
        accionForm: '1',
      })
    }
    else if (this.data.tipo_accion === 'Salida') {
      this.DetalleHorarioForm.patchValue({
        accionForm: '2',
      })
    }
    else if (this.data.tipo_accion === 'S.Almuerzo') {
      this.DetalleHorarioForm.patchValue({
        accionForm: '3',
      })
    }
    else if (this.data.tipo_accion === 'E. Almuerzo') {
      this.DetalleHorarioForm.patchValue({
        accionForm: '4',
      })
    }
  }

}
