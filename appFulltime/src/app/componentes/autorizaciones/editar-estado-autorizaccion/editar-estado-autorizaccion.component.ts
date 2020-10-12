import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { AutorizacionService } from "src/app/servicios/autorizacion/autorizacion.service";
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-editar-estado-autorizaccion',
  templateUrl: './editar-estado-autorizaccion.component.html',
  styleUrls: ['./editar-estado-autorizaccion.component.css']
})
export class EditarEstadoAutorizaccionComponent implements OnInit {

  estados: Estado[] = [
    // { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' }
  ];

  estado = new FormControl('', Validators.required);

  public estadoAutorizacionesForm = new FormGroup({
    estadoF: this.estado
  });

  FechaActual: any;

  constructor(
    private restA: AutorizacionService,
    private toastr: ToastrService,
    private restP: PermisosService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<EditarEstadoAutorizaccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.data.auto.id_documento);
    console.log(this.data.empl[0].id_empleado);
    console.log(this.data.empl[0].estado);
    if (this.data.empl[0].estado === "Pendiente") {
      this.toastr.info('La autorización esta en pendiente. Pre-autoriza o Autoriza el permiso.')
    } else {
      this.estadoAutorizacionesForm.patchValue({
        estadoF: this.data.auto.estado
      });
    }

    this.tiempo();
  }

  tiempo() {
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    console.log('fecha Actual', this.FechaActual);
  }

  resAutorizacion: any = [];
  idNoti: any = [];
  ActualizarEstadoAutorizacion(form) {
    let newAutorizaciones = {
      id_documento: this.data.auto.id_documento + localStorage.getItem('empleado') + '_' + form.estadoF + ',',
      estado: form.estadoF,
      id_permiso: this.data.auto.id_permiso, 
      id_departamento: this.data.auto.id_departamento,
      id_empleado: this.data.empl[0].id_empleado
    }
    console.log(newAutorizaciones);
    
    this.restA.PutEstadoAutoPermiso(this.data.auto.id, newAutorizaciones).subscribe(res => {
      this.resAutorizacion = [res];
      console.log(this.resAutorizacion);
      this.toastr.success('Operación exitosa','Estado Actualizado');
      var f = new Date();
      let notificacion = { 
        id: null,
        id_send_empl: this.resAutorizacion[0].realtime[0].id_send_empl,
        id_receives_empl: this.data.empl[0].id_empleado,
        id_receives_depa: this.resAutorizacion[0].realtime[0].id_receives_depa,
        estado: this.resAutorizacion[0].realtime[0].estado, 
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`, 
        id_permiso: this.resAutorizacion[0].realtime[0].id_permiso,
        id_vacaciones: null,
        id_hora_extra: null
      }

      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(respo => {
        this.idNoti = [respo];
        console.log(this.resAutorizacion[0].notificacion);
        console.log(this.idNoti[0]._id);
        notificacion.id = this.idNoti[0]._id;
        if (this.idNoti[0]._id > 0 && this.resAutorizacion[0].notificacion === true ) {
          this.restP.sendNotiRealTime(notificacion);
        }
        this.dialogRef.close();
      });
    })
  }

}
