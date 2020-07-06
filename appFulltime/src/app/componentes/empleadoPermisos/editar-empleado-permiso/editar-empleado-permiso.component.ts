import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';

interface Estados {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-editar-empleado-permiso',
  templateUrl: './editar-empleado-permiso.component.html',
  styleUrls: ['./editar-empleado-permiso.component.css']
})
export class EditarEmpleadoPermisoComponent implements OnInit {

  estadoF = new FormControl('');

  public PermisoForm = new FormGroup({
    estadoForm: this.estadoF
  });

  estados: Estados[] = [
    { valor: 'Pendiente', nombre: 'Pendiente' },
    { valor: 'Rechazado', nombre: 'Rechazado' },
    { valor: 'Aceptado', nombre: 'Aceptado' },
    { valor: 'Eliminado', nombre: 'Eliminado' }
  ];

  id_empleado_loggin: number;
  FechaActual: any;
  NotifiRes: any;

  constructor(
    private restP: PermisosService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<EditarEmpleadoPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('dat', this.data);
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

    this.llenarForm();
    this.id_empleado_loggin = parseInt(localStorage.getItem('empleado')); 
  }

  llenarForm(){
    this.PermisoForm.patchValue({
      estadoForm: this.data.permiso.estado
    });
  }

  EditarEstadoPermiso(form){
    let datosPermiso = {
      estado: form.estadoForm
    }

    this.restP.ActualizarEstado(this.data.permiso.id, datosPermiso).subscribe(res => {
      console.log(res);
  
      var f = new Date();
      let notificacion = { 
        id: null,
        id_send_empl: this.id_empleado_loggin,
        id_receives_empl: this.data.permiso.id_empleado,
        id_receives_depa: this.data.depa[0].id,
        estado: form.estadoForm, 
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`, 
        id_permiso: this.data.permiso.id,
        id_vacaciones: null
      }
      console.log(notificacion);
      
      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res => {
        console.log(res);
        this.NotifiRes = res;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0) {
          this.restP.sendNotiRealTime(notificacion);
        }
      });
      this.dialogRef.close();
      //window.location.reload();
    });
  }

  CerrarVentanaPermiso() {
    this.dialogRef.close();
  }
}
