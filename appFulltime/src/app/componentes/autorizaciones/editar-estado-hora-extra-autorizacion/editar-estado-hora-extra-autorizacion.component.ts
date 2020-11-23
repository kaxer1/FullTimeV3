import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-editar-estado-hora-extra-autorizacion',
  templateUrl: './editar-estado-hora-extra-autorizacion.component.html',
  styleUrls: ['./editar-estado-hora-extra-autorizacion.component.css']
})
export class EditarEstadoHoraExtraAutorizacionComponent implements OnInit {

  estados: Estado[] = [
    // { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  estado = new FormControl('', Validators.required);

  public estadoAutorizacionesForm = new FormGroup({
    estadoF: this.estado
  });

  id_empleado_loggin: number;
  FechaActual: any;
  NotifiRes: any;

  constructor(
    private restA: AutorizacionService,
    private toastr: ToastrService,
    public restPH: PedHoraExtraService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<EditarEstadoHoraExtraAutorizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id_empleado_loggin = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    console.log(this.data.empl);
    if (this.data.autorizacion[0].estado === 1) {
      this.toastr.info('La autorización esta en pendiente. Pre-autoriza o Autoriza el permiso.','', {
        timeOut: 6000,
      })
    } else {
      this.estadoAutorizacionesForm.patchValue({
        estadoF: this.data.autorizacion[0].estado
      });
    }
    this.tiempo();
  }

  tiempo() {
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
  }

  resAutorizacion: any = [];
  idNoti: any = [];
  ActualizarEstadoAutorizacion(form) {
    let newAutorizaciones = {
      id_documento: this.data.autorizacion[0].id_documento + localStorage.getItem('empleado') + '_' + form.estadoF + ',',
      estado: form.estadoF,
      id_hora_extra: this.data.autorizacion[0].id_hora_extra,
      id_departamento: this.data.autorizacion[0].id_departamento,
    }
    console.log(newAutorizaciones);
    this.restA.PutEstadoAutoHoraExtra(this.data.autorizacion[0].id_hora_extra, newAutorizaciones).subscribe(res => {
      this.resAutorizacion = [res];
      console.log(this.resAutorizacion);
      this.toastr.success('Operación exitosa', 'Estado Actualizado', {
        timeOut: 6000,
      });
      this.EditarEstadoHoraExtra(form);
    })
  }

  resEstado: any = [];
  EditarEstadoHoraExtra(form) {
    let datosHorasExtras = {
      estado: form.estadoF,
      id_hora_extra: this.data.autorizacion[0].id_hora_extra,
      id_departamento: this.data.autorizacion[0].id_departamento,
    }
    this.restPH.ActualizarEstado(this.data.autorizacion[0].id_hora_extra, datosHorasExtras).subscribe(res => {
      this.resEstado = [res];
      var f = new Date();
      let notificacion = {
        id: null,
        id_send_empl: this.id_empleado_loggin,
        id_receives_empl: this.data.empl,
        id_receives_depa: this.data.autorizacion[0].id_departamento,
        estado: form.estadoF,
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`,
        id_permiso: null,
        id_vacaciones: null,
        id_hora_extra: this.data.autorizacion[0].id_hora_extra
      }
      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res1 => {
        this.NotifiRes = res1;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0 && this.resEstado[0].notificacion === true) {
          this.restPH.sendNotiRealTime(notificacion);
        }
      });
      this.dialogRef.close();
    })
  }

}
