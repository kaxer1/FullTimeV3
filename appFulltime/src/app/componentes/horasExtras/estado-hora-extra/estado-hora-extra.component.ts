import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

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
    { valor: 2, nombre: 'Rechazado' },
    { valor: 3, nombre: 'Aceptado' },
    { valor: 4, nombre: 'Eliminado' }
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
    var f = new Date();
    if (f.getMonth() < 10 && f.getDate() < 10) {
      this.FechaActual = f.getFullYear() + "-0" + [f.getMonth() + 1] + "-0" + f.getDate();
    } else if (f.getMonth() >= 10 && f.getDate() >= 10) {
      this.FechaActual = f.getFullYear() + "-" + [f.getMonth() + 1] + "-" + f.getDate();
    } else if (f.getMonth() < 10 && f.getDate() >= 10) {
      this.FechaActual = f.getFullYear() + "-0" + [f.getMonth() + 1] + "-" + f.getDate();
    } else if (f.getMonth() >= 10 && f.getDate() < 10) {
      this.FechaActual = f.getFullYear() + "-" + [f.getMonth() + 1] + "-0" + f.getDate();
    }
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
