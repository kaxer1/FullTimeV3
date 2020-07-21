import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { AotCompiler } from '@angular/compiler';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-editar-estado-vacacion-autoriacion',
  templateUrl: './editar-estado-vacacion-autoriacion.component.html',
  styleUrls: ['./editar-estado-vacacion-autoriacion.component.css']
})
export class EditarEstadoVacacionAutoriacionComponent implements OnInit {

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente'},
    { id: 2, nombre: 'Pre-autorizado'},
    { id: 3, nombre: 'Autorizado'},
    { id: 4, nombre: 'Negado'},
  ];
  
  estado = new FormControl('', Validators.required);

  public estadoAutorizacionesForm = new FormGroup({
    estadoF: this.estado
  });

  FechaActual: any;

  constructor(
    private restA: AutorizacionService,
    private toastr: ToastrService,
    private realTime: RealTimeService,
    private restV: VacacionesService,
    public dialogRef: MatDialogRef<EditarEstadoVacacionAutoriacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.data.datosSeleccionados);
    this.tiempo();
    this.estadoAutorizacionesForm.patchValue({
      estadoF: this.data.datosSeleccionados.estado
    });
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

  autorizacion: any = [];
  idNoti: any = [];
  ActualizarEstadoAutorizacion(form){
    let newAutorizaciones = {
      estado: form.estadoF,
      id_vacaciones: this.data.datosSeleccionados.id_vacacion, 
      id_departamento: this.data.datosSeleccionados.id_departamento,
      id_empleado: this.data.id_rece_emp
    }

    this.restA.PutEstadoAutoVacacion(this.data.datosSeleccionados.id, newAutorizaciones).subscribe(res => {
      this.autorizacion = [res];
      
      this.toastr.success('Operación exitosa','Estado Actualizado');
      var f = new Date();
      let notificacion = { 
        id: null,
        id_send_empl: this.autorizacion[0].realtime[0].id_send_empl,
        id_receives_empl: this.data.id_rece_emp,
        id_receives_depa: this.autorizacion[0].realtime[0].id_receives_depa,
        estado: this.autorizacion[0].realtime[0].estado, 
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`, 
        id_vacaciones: this.autorizacion[0].realtime[0].id_vacaciones,
        id_permiso: null,
        id_hora_extra: null
      }

      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(respo => {
        this.idNoti = [respo];
        console.log(this.autorizacion[0].notificacion);
        console.log(this.idNoti[0]._id);
        notificacion.id = this.idNoti[0]._id;
        if (this.idNoti[0]._id > 0 && this.autorizacion[0].notificacion === true ) {
          this.restV.sendNotiRealTime(notificacion);
        }
        this.dialogRef.close();
      });
    })
  }
}
