import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';


@Component({
  selector: 'app-detalle-cat-horario',
  templateUrl: './detalle-cat-horario.component.html',
  styleUrls: ['./detalle-cat-horario.component.css']
})
export class DetalleCatHorarioComponent implements OnInit {

  nocturno = false;
  horarios: any = [];

  horarioF = new FormControl('', [Validators.required]);
  ordenF = new FormControl('', [Validators.required]);
  accionF = new FormControl('', [Validators.required]);
  horaF = new FormControl('', [Validators.required]);
  minEsperaF = new FormControl('');
  tipoF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public DetalleHorarioForm = new FormGroup({
    horarioForm: this.horarioF,
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
    public dialogRef: MatDialogRef<DetalleCatHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
  ) { }

  ngOnInit(): void {
    this.BuscarHorarios();
  }

  BuscarHorarios() {
    this.horarios = [];
    this.restH.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
    })
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
      id_horario: form.horarioForm,
      tipo_accion: form.accionForm,
    };
    console.log(datosDetalleH);
    this.ValidarMinEspera(form, datosDetalleH);
    console.log(datosDetalleH);
    this.rest.IngresarDetalleHorarios(datosDetalleH).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Detalle de Horario registrado')
      this.LimpiarCampos();
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
    window.location.reload();
  }

}
