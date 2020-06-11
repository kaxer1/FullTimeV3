import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { PeriodoVacacionesService } from 'src/app/servicios/periodoVacaciones/periodo-vacaciones.service';


@Component({
  selector: 'app-editar-periodo-vacaciones',
  templateUrl: './editar-periodo-vacaciones.component.html',
  styleUrls: ['./editar-periodo-vacaciones.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class EditarPeriodoVacacionesComponent implements OnInit {

  // Datos del empleado
  empleados: any = [];
  periodoDatos: any = [];
  selec1 = false;
  selec2 = false;

  // Control de campos y validaciones del formulario
  nombreEmpleadoF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  diaVacacionF = new FormControl('', [Validators.required]);
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
    public dialogRef: MatDialogRef<EditarPeriodoVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.ObtenerEmpleados(this.data.idEmpleado);
    this.PerVacacionesForm.patchValue({
      diaVacacionForm: 0,
      diaAntiguedadForm: 0,
      diaPerdidoForm: 0
    });
    this.ImprimirDatos();
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

  ImprimirDatos() {
    this.PerVacacionesForm.patchValue({
      descripcionForm: this.data.datosPeriodo.descripcion,
      diaVacacionForm: this.data.datosPeriodo.dia_vacacion,
      diaAntiguedadForm: this.data.datosPeriodo.dia_antiguedad,
      estadoForm: this.data.datosPeriodo.estado,
      fechaFinForm: this.data.datosPeriodo.fec_final,
      fechaInicioForm: this.data.datosPeriodo.fec_inicio,
      diaPerdidoForm: this.data.datosPeriodo.dia_perdido
    });
    console.log("estado", this.data.datosPeriodo.estado)
    if (this.data.datosPeriodo.estado === 1) {
      this.selec1 = true;
    }
    else {
      this.selec2 = true;
    }
  }

  ValidarDatosPerVacacion(form) {
    if (form.fechaFinForm === '') {
      form.fechaFinForm = null;
      this.ActualizarPerVacacion(form);
    } else {
      if (Date.parse(form.fechaInicioForm) < Date.parse(form.fechaFinForm)) {
        this.ActualizarPerVacacion(form);
      }
      else {
        this.toastr.info('La fecha de finalización de período debe ser mayor a la fecha de inicio de período')
      }
    }
  }

  ActualizarPerVacacion(form) {
    let datosPerVacaciones = {
      id: this.data.datosPeriodo.id,
      id_empl_contrato: this.data.datosPeriodo.id_empl_contrato,
      descripcion: form.descripcionForm,
      dia_vacacion: form.diaVacacionForm,
      dia_antiguedad: form.diaAntiguedadForm,
      estado: form.estadoForm,
      fec_inicio: form.fechaInicioForm,
      fec_final: form.fechaFinForm,
      dia_perdido: form.diaPerdidoForm
    };
    this.restV.ActualizarPeriodoV(datosPerVacaciones).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Período de Vacaciones actualizado')
      this.CerrarVentanaRegistroPerVacaciones();
    }, error => {
      this.toastr.error('Operación Fallida', 'Período de Vacaciones no fue actualizado')
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }


}
