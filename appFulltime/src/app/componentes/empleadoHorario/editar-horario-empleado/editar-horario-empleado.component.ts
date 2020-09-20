import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';


@Component({
  selector: 'app-editar-horario-empleado',
  templateUrl: './editar-horario-empleado.component.html',
  styleUrls: ['./editar-horario-empleado.component.css']
})
export class EditarHorarioEmpleadoComponent implements OnInit {

  dataItem: any;

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
    public dialogRef: MatDialogRef<EditarHorarioEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataItem = 4;
  }

  ngOnInit(): void {
    this.BuscarHorarios();
    this.CargarDatos();
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
    let fechas = {
      fechaInicio: form.fechaInicioForm,
      fechaFinal: form.fechaFinalForm,
    };
    this.rest.VerificarDuplicidadHorariosEdicion(this.data.datosHorario.id, this.data.idEmpleado, fechas).subscribe(response => {
      this.toastr.success('Las fechas ingresadas ya se encuntran registradas en otro horario');
    }, error => {
      let datosempleH = {
        id_empl_cargo: this.data.datosHorario.id_empl_cargo,
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
        estado: form.estadoForm,
        id: this.data.datosHorario.id
      };
      console.log(datosempleH);
      this.rest.ActualizarDatos(datosempleH).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Horario del Empleado actualizado')
        this.CerrarVentanaEmpleadoHorario();
      }, error => { });
    });
  }

  LimpiarCampos() {
    this.EmpleadoHorarioForm.reset();
  }

  CerrarVentanaEmpleadoHorario() {
    this.LimpiarCampos();
    this.dialogRef.close(this.dataItem);
    //window.location.reload();
  }

  CargarDatos() {
    this.EmpleadoHorarioForm.patchValue({
      horarioForm: this.data.datosHorario.id_horarios,
      fechaInicioForm: this.data.datosHorario.fec_inicio,
      fechaFinalForm: this.data.datosHorario.fec_final,
      estadoForm: String(this.data.datosHorario.estado),
      lunesForm: this.data.datosHorario.lunes,
      martesForm: this.data.datosHorario.martes,
      miercolesForm: this.data.datosHorario.miercoles,
      juevesForm: this.data.datosHorario.jueves,
      viernesForm: this.data.datosHorario.viernes,
      sabadoForm: this.data.datosHorario.sabado,
      domingoForm: this.data.datosHorario.domingo
    })
    this.lunes = this.data.datosHorario.lunes;
    this.martes = this.data.datosHorario.martes;
    this.miercoles = this.data.datosHorario.miercoles;
    this.jueves = this.data.datosHorario.jueves;
    this.viernes = this.data.datosHorario.viernes;
    this.sabado = this.data.datosHorario.sabado;
    this.domingo = this.data.datosHorario.domingo;
  }


}
