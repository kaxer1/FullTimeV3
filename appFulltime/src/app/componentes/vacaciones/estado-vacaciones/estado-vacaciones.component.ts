import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';

interface Estados {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-estado-vacaciones',
  templateUrl: './estado-vacaciones.component.html',
  styleUrls: ['./estado-vacaciones.component.css']
})
export class EstadoVacacionesComponent implements OnInit {

  estados: Estados[] = [
    { valor: 'Solicitado', nombre: 'Solicitado' },
    { valor: 'Rechazado', nombre: 'Rechazado' },
    { valor: 'Aceptado', nombre: 'Aceptado' },
    { valor: 'Eliminado', nombre: 'Eliminado' }
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
    this.VacacionForm.patchValue({
      estadoForm: this.data.vacacion.estado
    });
  }

  EditarEstadoVacacion(form){
    let datosVacacion = {
      estado: form.estadoForm
    }

    this.restV.ActualizarEstado(this.data.vacacion.id, datosVacacion).subscribe(res => {
      console.log(res);
      // this.dialogRef.close();
      // window.location.reload();
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
        console.log(res);
        this.NotifiRes = res;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0) {
          this.restV.sendNotiRealTime(notificacion);
        }
      });

    });
  }

  CerrarVentanaPermiso() {
    this.dialogRef.close();
  }
}
