import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';

interface Estados {
  valor: number;
  nombre: string
}
@Component({
  selector: 'app-estado-hora-extra',
  templateUrl: './estado-hora-extra.component.html',
  styleUrls: ['./estado-hora-extra.component.css']
})
export class EstadoHoraExtraComponent implements OnInit {

  estadoF = new FormControl('');

  public HoraExtraForm = new FormGroup({
    estadoForm: this.estadoF
  });

  estados: Estados[] = [
    { valor: 1, nombre: 'Pendiente' },
    { valor: 2, nombre: 'Pre-Autorizado'},
    { valor: 3, nombre: 'Aceptado' },
    { valor: 4, nombre: 'Rechazado' }
  ];

  id_empleado_loggin: number;
  FechaActual: any;
  NotifiRes: any;

  constructor(
    private realTime: RealTimeService,
    private restH: PedHoraExtraService,
    public dialogRef: MatDialogRef<EstadoHoraExtraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.tiempo();
    this.llenarForm();
  }

  tiempo () {
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    console.log('fecha Actual', this.FechaActual);
    this.id_empleado_loggin = parseInt(localStorage.getItem('empleado')); 
  }

  llenarForm(){
    this.HoraExtraForm.patchValue({
      estadoForm: this.data.estado
    });
  }

  resEstado: any = [];
  EditarEstadoHoraExtra(form) {
    let datosHorasExtras = {
      estado: form.estadoForm,
      id_hora_extra: this.data.id, 
      id_departamento: this.data.id_departamento,
    }

    this.restH.ActualizarEstado(this.data.id, datosHorasExtras).subscribe(res => {
      this.resEstado = [res];
      console.log(this.resEstado);
      console.log(this.resEstado[0].realtime[0].estado);
      var f = new Date();
      // let nomEstado = '';
      // this.estados.forEach(obj => {
      //   if(obj.valor = form.estadoForm) {
      //     nomEstado = obj.nombre
      //   }
      // })
      let notificacion = { 
        id: null,
        id_send_empl: this.id_empleado_loggin,
        id_receives_empl: this.data.id_usua_solicita,
        id_receives_depa: this.data.id_departamento,
        estado: this.resEstado[0].realtime[0].estado, 
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`, 
        id_permiso: null,
        id_vacaciones: null,
        id_hora_extra: this.data.id
      }
      console.log(notificacion);
      
      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res1 => {
        console.log(res1);
        this.NotifiRes = res1;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0 && this.resEstado[0].notificacion === true) {
          this.restH.sendNotiRealTime(notificacion);
        }
      });
      this.dialogRef.close();
    })
  }

}
