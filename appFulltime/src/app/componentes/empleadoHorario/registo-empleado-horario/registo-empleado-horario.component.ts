import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';


@Component({
  selector: 'app-registo-empleado-horario',
  templateUrl: './registo-empleado-horario.component.html',
  styleUrls: ['./registo-empleado-horario.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class RegistoEmpleadoHorarioComponent implements OnInit {

  lunes = false;
  martes = false;
  miercoles = false;
  jueves = false;
  viernes = false;
  sabado = false;
  domingo = false;
  horarios: any = [];

  horarioF = new FormControl('', [Validators.required]);
  fechaInicioF = new FormControl('', Validators.required);
  fechaFinalF = new FormControl('', [Validators.required]);
  estadoF = new FormControl('', [Validators.required]);
  lunesF = new FormControl('');
  martesF = new FormControl('');
  miercolesF = new FormControl('');
  juevesF = new FormControl('');
  viernesF = new FormControl('');
  sabadoF = new FormControl('');
  domingoF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public EmpleadoHorarioForm = new FormGroup({
    horarioForm: this.horarioF,
    fechaInicioForm: this.fechaInicioF,
    fechaFinalForm: this.fechaFinalF,
    estadoForm: this.estadoF,
    lunesForm: this.lunesF,
    martesForm: this.martesF,
    miercolesForm: this.miercolesF,
    juevesForm: this.juevesF,
    viernesForm: this.viernesF,
    sabadoForm: this.sabadoF,
    domingoForm: this.domingoF
  });

  constructor(
    public rest: EmpleadoHorariosService,
    public restH: HorarioService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistoEmpleadoHorarioComponent>,
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

  ValidarFechas(form) {
      if (Date.parse(form.fechaInicioForm) < Date.parse(form.fechaFinalForm)) {
        this.InsertarEmpleadoHorario(form);
      }
      else {
        this.toastr.info('La fecha de inicio de actividades debe ser mayor a la fecha de fin de actividades')
      }
  }

  InsertarEmpleadoHorario(form) {
    let datosempleH= {
      id_empl_cargo: this.datoEmpleado.idCargo,
      id_hora: 0,
      fec_inicio: form.fechaInicioForm,
      fec_final: form.fechaFinalForm,
      lunes: form.lunesForm,
      martes: form.martesForm,
      miercoles: form.miercolesForm,
      jueves: form.juevesForm,
      viernes: form.viernesForm,
      sabado: form.sabadoForm,
      domingo: form.domingoForm,
      id_horarios: form.horarioForm,
      estado: form.estadoForm
    };
    console.log(datosempleH);
    this.rest.IngresarEmpleadoHorarios(datosempleH).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Horario del Empleado registrado')
      this.LimpiarCampos();
    }, error => {
    });
  }

  LimpiarCampos() {
    this.EmpleadoHorarioForm.reset();
  }

  CerrarVentanaEmpleadoHorario() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
