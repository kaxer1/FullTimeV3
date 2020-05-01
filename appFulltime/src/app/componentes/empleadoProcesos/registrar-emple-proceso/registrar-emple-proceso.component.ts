import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpleadoProcesosService } from 'src/app/servicios/empleado/empleadoProcesos/empleado-procesos.service';

@Component({
  selector: 'app-registrar-emple-proceso',
  templateUrl: './registrar-emple-proceso.component.html',
  styleUrls: ['./registrar-emple-proceso.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class RegistrarEmpleProcesoComponent implements OnInit {

  empleados: any = [];

  nombreEmpleado = new FormControl('', [Validators.required]);
  fechaInicio = new FormControl('', Validators.required);
  fechaFinal = new FormControl('', Validators.required);

  public EmpleProcesoForm = new FormGroup({
    fecInicioForm: this.fechaInicio,
    fecFinalForm: this.fechaFinal,
    nombreEmpleadoForm: this.nombreEmpleado,
  });

  constructor(
    private rest: EmpleadoService,
    private restP: EmpleadoProcesosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarEmpleProcesoComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
  ) { }

  ngOnInit(): void {
    this.ObtenerEmpleados(this.datoEmpleado.idEmpleado);
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleados = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleados = data;
      console.log(this.empleados)
      this.EmpleProcesoForm.patchValue({
        nombreEmpleadoForm: this.empleados[0].nombre + ' ' + this.empleados[0].apellido,
      })
    })
  }

  ValidarDatosProeso(form) {
    if (Date.parse(form.fecInicioForm) < Date.parse(form.fecFinalForm)) {
      this.InsertarProceso(form);
    }
    else {
      this.toastr.info('La fecha de finalización debe ser mayor a la fecha de inicio')
    }
  }

  InsertarProceso(form) {
    let datosProceso = {
      id_empl_cargo: this.datoEmpleado.idCargo,
      fec_inicio: form.fecInicioForm,
      fec_final: form.fecFinalForm,
    };
    this.restP.RegistrarEmpleProcesos(datosProceso).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Período de Procesos del Empleado registrados')
      this.CerrarVentanaRegistroProceso();
    }, error => {
      this.toastr.error('Operación Fallida', 'Registro Inválido')
    });
  }

  LimpiarCampos() {
    this.EmpleProcesoForm.reset();
  }

  CerrarVentanaRegistroProceso() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
