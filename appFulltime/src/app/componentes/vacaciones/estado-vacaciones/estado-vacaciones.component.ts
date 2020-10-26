import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';

interface Estados {
  valor: number;
  nombre: string
}

@Component({
  selector: 'app-estado-vacaciones',
  templateUrl: './estado-vacaciones.component.html',
  styleUrls: ['./estado-vacaciones.component.css']
})
export class EstadoVacacionesComponent implements OnInit {

  estados: Estados[] = [
    { valor: 1, nombre: 'Pendiente' },
    { valor: 2, nombre: 'Pre-autorizado' },
    { valor: 3, nombre: 'Autorizado' },
    { valor: 4, nombre: 'Negado' }
  ];

  estadoF = new FormControl('');

  public VacacionForm = new FormGroup({
    estadoForm: this.estadoF
  });

  id_empleado_loggin: number;
  FechaActual: any;
  NotifiRes: any;

  constructor(
    private restV: VacacionesService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<EstadoVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    this.llenarForm();
    this.id_empleado_loggin = parseInt(localStorage.getItem('empleado')); 
  }

  llenarForm(){
    this.VacacionForm.patchValue({
      estadoForm: this.data.vacacion.estado
    });
  }

  resVacacion: any = [];
  EditarEstadoVacacion(form){
    let datosVacacion = {
      estado: form.estadoForm,
      id_vacacion: this.data.vacacion.id,
      id_rece_emp: this.data.vacacion.id_empleado,
      id_depa_send: this.data.depa[0].id
    }

    this.restV.ActualizarEstado(this.data.vacacion.id, datosVacacion).subscribe(respon => {
      this.resVacacion = respon
      console.log(this.resVacacion);
      var f = new Date();
      let notificacion = { 
        id: null,
        id_send_empl: this.id_empleado_loggin,
        id_receives_empl: this.data.vacacion.id_empleado,
        id_receives_depa: this.data.depa[0].id,
        estado: form.estadoForm, 
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`, 
        id_vacaciones: this.data.vacacion.id,
        id_permiso: null
      }
      console.log(notificacion);
      
      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res => {
        this.NotifiRes = res;
        console.log(this.NotifiRes);
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0 && this.resVacacion.notificacion === true) {
          this.restV.sendNotiRealTime(notificacion);
        }
        this.dialogRef.close();
      });

    });
  }

  CerrarVentanaPermiso() {
    this.dialogRef.close();
  }
}
