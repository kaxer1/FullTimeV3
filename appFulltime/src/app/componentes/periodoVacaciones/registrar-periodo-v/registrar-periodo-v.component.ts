import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';

@Component({
  selector: 'app-registrar-periodo-v',
  templateUrl: './registrar-periodo-v.component.html',
  styleUrls: ['./registrar-periodo-v.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class RegistrarPeriodoVComponent implements OnInit {

  // Datos del empleado
  empleados: any = [];

  // Control de campos y validaciones del formulario
  nombreEmpleadoF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  diaVacacionF = new FormControl('', [Validators.required]);
  horaVacacionF = new FormControl('', [Validators.required]);
  minVacacionF = new FormControl('', [Validators.required]);
  diaAntiguedadF = new FormControl('', [Validators.required]);
  estadoF = new FormControl('', [Validators.required]);
  fechaFinF = new FormControl('');
  fechaInicioF = new FormControl('', [Validators.required]);
  diaPerdidoF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public PerVacacionesForm = new FormGroup({
    nombreEmpleadoForm: this.nombreEmpleadoF,
    descripcionForm: this.descripcionF,
    diaVacacionForm: this.diaVacacionF,
    horaVacacionForm: this.horaVacacionF,
    minVacacionForm: this.minVacacionF,
    diaAntiguedadForm: this.diaAntiguedadF,
    estadoForm: this.estadoF,
    fechaFinForm: this.fechaFinF,
    fechaInicioForm: this.fechaInicioF,
    diaPerdidoForm: this.diaPerdidoF
  });

  constructor(
    private rest: EmpleadoService,
    private restV: PeriodoVacacionesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarPeriodoVComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
  ) { }

  ngOnInit(): void {
    this.ObtenerEmpleados(this.datoEmpleado.idEmpleado);
    this.ObtenerContrato();
    this.PerVacacionesForm.patchValue({
      diaVacacionForm: 0,
      horaVacacionForm: 0,
      minVacacionForm: 0,
      diaAntiguedadForm: 0,
      diaPerdidoForm: 0
    })
  }

  // Método para ver la información del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleados = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleados = data;
      console.log(this.empleados)
      this.PerVacacionesForm.patchValue({
        nombreEmpleadoForm: this.empleados[0].nombre + ' ' + this.empleados[0].apellido,
      })
    })
  }


  // Método para ver la información del empleado 
  datosContrato: any = [];
  ObtenerContrato() {
    this.datosContrato = [];
    this.rest.BuscarDatosContrato(this.datoEmpleado.idContrato).subscribe(data => {
      this.datosContrato = data;
      var fecha = new Date(String(data[0].fec_ingreso));
      this.PerVacacionesForm.patchValue({ fechaInicioForm: data[0].fec_ingreso });
      if (data[0].descripcion === 'CODIGO DE TRABAJO') {
        fecha.setMonth(fecha.getMonth() + 12);
        this.PerVacacionesForm.patchValue({ fechaFinForm: fecha });
      }
      else if (data[0].descripcion === 'LOSEP') {
        fecha.setMonth(fecha.getMonth() + 11);
        this.PerVacacionesForm.patchValue({ fechaFinForm: fecha });
      }
      else if (data[0].descripcion === 'LOES') {
        fecha.setMonth(fecha.getMonth() + 11);
        this.PerVacacionesForm.patchValue({ fechaFinForm: fecha });
      }
    })
  }

  ValidarDatosPerVacacion(form) {
    if (form.fechaFinForm === '') {
      form.fechaFinForm = null;
      this.InsertarPerVacacion(form);
    } else {
      if (Date.parse(form.fechaInicioForm) < Date.parse(form.fechaFinForm)) {
        this.InsertarPerVacacion(form);
      }
      else {
        this.toastr.info('La fecha de finalización de período debe ser mayor a la fecha de inicio de período', '', {
          timeOut: 6000,
        })
      }
    }
  }

  InsertarPerVacacion(form) {
    let datosPerVacaciones = {
      id_empl_contrato: this.datoEmpleado.idContrato,
      descripcion: form.descripcionForm,
      dia_vacacion: form.diaVacacionForm,
      dia_antiguedad: form.diaAntiguedadForm,
      estado: form.estadoForm,
      fec_inicio: form.fechaInicioForm,
      fec_final: form.fechaFinForm,
      dia_perdido: form.diaPerdidoForm,
      horas_vacaciones: form.horaVacacionForm,
      min_vacaciones: form.minVacacionForm,
    };
    this.restV.CrearPerVacaciones(datosPerVacaciones).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Período de Vacaciones registrado', {
        timeOut: 6000,
      })
      this.CerrarVentanaRegistroPerVacaciones();
    }, error => {
      this.toastr.error('Operación Fallida', 'Período de Vacaciones no fue registrado', {
        timeOut: 6000,
      })
    });
  }

  LimpiarCampos() {
    this.PerVacacionesForm.reset();
  }

  CerrarVentanaRegistroPerVacaciones() {
    this.LimpiarCampos();
    this.dialogRef.close();
    //window.location.reload();
  }

  ObtenerMensajeErrorNombre() {
    if (this.descripcionF.hasError('required')) {
      return 'Campo obligatorio';
    }
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

  dInicio: any;
  validarFecha(event) {
    this.PerVacacionesForm.patchValue({
      fechaFinForm: ''
    });
    this.dInicio = event.value._i;
    var fecha = new Date(String(moment(this.dInicio)));
    var ingreso = String(moment(fecha, "YYYY/MM/DD").format("YYYY-MM-DD"));
    this.rest.BuscarDatosContrato(this.datoEmpleado.idContrato).subscribe(data => {
      if (Date.parse(data[0].fec_ingreso.split('T')[0]) <= Date.parse(ingreso)) {
        if (data[0].descripcion === 'CODIGO DE TRABAJO') {
          fecha.setMonth(fecha.getMonth() + 12);
          this.PerVacacionesForm.patchValue({ fechaFinForm: fecha });
        }
        else if (data[0].descripcion === 'LOSEP') {
          fecha.setMonth(fecha.getMonth() + 11);
          this.PerVacacionesForm.patchValue({ fechaFinForm: fecha });
        }
        else if (data[0].descripcion === 'LOES') {
          fecha.setMonth(fecha.getMonth() + 11);
          this.PerVacacionesForm.patchValue({ fechaFinForm: fecha });
        }
      }
      else {
        this.PerVacacionesForm.patchValue({ fechaInicioForm: '' });
        this.toastr.info('La fecha de inicio de periodo no puede ser anterior a la fecha de ingreso de contrato.', '', {
          timeOut: 6000,
        });
      }
    })
  }

}
