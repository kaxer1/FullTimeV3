import { Component, OnInit } from '@angular/core';
import { NotiAutorizacionesService } from 'src/app/servicios/catalogos/catNotiAutorizaciones/noti-autorizaciones.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificacionesService } from 'src/app/servicios/catalogos/catNotificaciones/notificaciones.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';

interface Orden {
  valor: number
}

@Component({
  selector: 'app-noti-autorizaciones',
  templateUrl: './noti-autorizaciones.component.html',
  styleUrls: ['./noti-autorizaciones.component.css']
})
export class NotiAutorizacionesComponent implements OnInit {

  idCatNotificacion = new FormControl('', Validators.required);
  idEmplCargo = new FormControl('', Validators.required);
  orden = new FormControl('', Validators.required);

  public nuevaNoti_AutorizacionesForm = new FormGroup({
    idCatNotificacionForm: this.idCatNotificacion,
    idEmplCargoForm: this.idEmplCargo,
    ordenForm: this.orden,
  });

  cargo: any = [];
  notificacion: any = [];

  ordenes: Orden[] = [
    { valor: 0},
    { valor: 1},
    { valor: 2},
    { valor: 3},
    { valor: 4},
    { valor: 5}
  ];
  
  constructor(
    public restNotiAutorizaciones: NotiAutorizacionesService,
    public restNotificaciones: NotificacionesService,
    public restCargoEmpleado: EmplCargosService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerCargo();
    this.obtenerNotificacion();
  }

  insertarNotiAutorizacion(form){
    let newNotiAutori = {
      id_notificacion: form.idCatNotificacionForm,
      id_empl_cargo: form.idEmplCargoForm,
      orden: form.ordenForm
    }
    console.log(newNotiAutori);
    this.restNotiAutorizaciones.postNotiAutoriRest(newNotiAutori).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Autorizacion de Notificación guardada'),
      this.limpiarCampos();
    }, error => {
      console.log(error);
    })
  }

  obtenerCargo(){
    this.restCargoEmpleado.getEmpleadoCargosRest().subscribe(res => {
      console.log(res);
      this.cargo = res;
    });
  }

  obtenerNotificacion(){
    this.restNotificaciones.getNotificacionesRest().subscribe(res => {
      console.log(res);
      this.notificacion = res;
    });
  }

  limpiarCampos(){
    this.nuevaNoti_AutorizacionesForm.reset();
  }

}
