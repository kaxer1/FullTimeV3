import { Component, OnInit, Inject } from '@angular/core';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { ToastrService } from 'ngx-toastr';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
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

  FechaActual: any;

  constructor(
    private restA: AutorizacionService,
    private toastr: ToastrService,
    private restHE: PedHoraExtraService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<EditarEstadoHoraExtraAutorizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.data.empl);
    if (this.data.autorizacion[0].estado === 1) {
      this.toastr.info('La autorización esta en pendiente. Pre-autoriza o Autoriza el permiso.')
    } else {
      this.estadoAutorizacionesForm.patchValue({
        estadoF: this.data.autorizacion[0].estado
      });
    }
    this.tiempo();
  }

  tiempo() {
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
    
    this.restA.PutEstadoAutoHoraExtra(this.data.autorizacion[0].id, newAutorizaciones).subscribe(res => {
      this.resAutorizacion = [res];
      console.log(this.resAutorizacion);
      this.toastr.success('Operación exitosa','Estado Actualizado');
      var f = new Date();
      let notificacion = { 
        id: null,
        id_send_empl: this.resAutorizacion[0].realtime[0].id_send_empl,
        id_receives_empl: this.data.empl,
        id_receives_depa: this.resAutorizacion[0].realtime[0].id_receives_depa,
        estado: this.resAutorizacion[0].realtime[0].estado, 
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`, 
        id_permiso: null,
        id_vacaciones: null,
        id_hora_extra: this.resAutorizacion[0].realtime[0].id_hora_extra
      }

      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(respo => {
        this.idNoti = [respo];
        console.log(this.resAutorizacion[0].notificacion);
        console.log(this.idNoti[0]._id);
        notificacion.id = this.idNoti[0]._id;
        if (this.idNoti[0]._id > 0 && this.resAutorizacion[0].notificacion === true ) {
          this.restHE.sendNotiRealTime(notificacion);
        }
        this.dialogRef.close();
      });
    })
  }

}
