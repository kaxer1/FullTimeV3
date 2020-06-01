import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';

@Component({
  selector: 'app-registrar-vacaciones',
  templateUrl: './registrar-vacaciones.component.html',
  styleUrls: ['./registrar-vacaciones.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class RegistrarVacacionesComponent implements OnInit {

  empleados: any = [];

  nombreEmpleado = new FormControl('', [Validators.required]);
  fechaInicio = new FormControl('', Validators.required);
  fechaFinal = new FormControl('', Validators.required);
  fechaIngreso = new FormControl('', Validators.required);
  dialibreF = new FormControl('', [Validators.required]);
  dialaborableF = new FormControl('', [Validators.required]);
  estadoF = new FormControl('', [Validators.required]);
  legalizadoF = new FormControl('', [Validators.required]);

  public VacacionesForm = new FormGroup({
    fecInicioForm: this.fechaInicio,
    fecFinalForm: this.fechaFinal,
    nombreEmpleadoForm: this.nombreEmpleado,
    fechaIngresoForm: this.fechaIngreso,
    diaLibreForm: this.dialibreF,
    dialaborableForm: this.dialaborableF,
    estadoForm: this.estadoF,
    legalizadoForm: this.legalizadoF
  });

  constructor(
    private rest: EmpleadoService,
    private restV: VacacionesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
  ) { }

  ngOnInit(): void {
    this.ObtenerEmpleados(this.datoEmpleado.idEmpleado);
  }

  // Método para ver la información del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleados = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleados = data;
      console.log(this.empleados)
      this.VacacionesForm.patchValue({
        nombreEmpleadoForm: this.empleados[0].nombre + ' ' + this.empleados[0].apellido,
      })
    })
  }

  ValidarDatosVacacion(form) {
    if (Date.parse(form.fecInicioForm) < Date.parse(form.fecFinalForm) && Date.parse(form.fecInicioForm) < Date.parse(form.fechaIngresoForm)) {
      this.InsertarVacaciones(form);
    }
    else {
      this.toastr.info('La fecha de ingreso a trabajar y de finalización de vacaciones deben ser mayores a la fecha de salida a vacaciones')
    }
  }

  InsertarVacaciones(form) {
    let datosVacaciones = {
      fec_inicio: form.fecInicioForm,
      fec_final: form.fecFinalForm,
      fec_ingreso: form.fechaIngresoForm,
      estado: form.estadoForm,
      dia_libre: form.diaLibreForm,
      dia_laborable: form.dialaborableForm,
      legalizado: form.legalizadoForm,
      id_peri_vacacion: this.datoEmpleado.idPerVacacion
    };
    this.restV.RegistrarVacaciones(datosVacaciones).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Vacaciones del Empleado registradas')
      this.CerrarVentanaRegistroVacaciones();
    }, error => {
      this.toastr.error('Operación Fallida', 'Registro Inválido')
    });
  }

  LimpiarCampos() {
    this.VacacionesForm.reset();
  }

  CerrarVentanaRegistroVacaciones() {
    this.LimpiarCampos();
    this.dialogRef.close();
    //window.location.reload();
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
