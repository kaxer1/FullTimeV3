import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificacionesService } from 'src/app/servicios/catalogos/catNotificaciones/notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  tipo = new FormControl('', Validators.required);
  nivel = new FormControl('', Validators.required);
  idDepartamento = new FormControl('', Validators.required);
  idTipoPermiso = new FormControl('', Validators.required);

  public nuevaNotificacionForm = new FormGroup({
    tipoForm: this.tipo,
    nivelForm: this.nivel,
    idDepartamentoForm: this.idDepartamento,
    idTipoPermisoForm: this.idTipoPermiso
  });

  constructor(
    private toastr: ToastrService,
    private rest: NotificacionesService
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  ObtenerMensajeErrorTipoRequerido() {
    if (this.tipo.hasError('required')) {
      return 'Debe ingresar un tipo';
    }
  }

  ObtenerMensajeErrorNivelRequerido() {
    if (this.tipo.hasError('required')) {
      return 'Debe ingresar un nivel';
    }
  }

  ObtenerMensajeErrorDepartamentoRequerido() {
    if (this.tipo.hasError('required')) {
      return 'Debe ingresar un departamento';
    }
  }

  ObtenerMensajeErrorPermisoRequerido() {
    if (this.tipo.hasError('required')) {
      return 'Debe ingresar un tipo de permiso';
    }
  }

  insertarNotificacion(form){
    let newNoti = {
      tipo: form.tipoForm,
      nivel: form.nivelForm,
      id_departamento: form.idDepartamentoForm,
      id_tipo_permiso: form.idTipoPermisoForm
    }

    this.rest.postNotificacionesRest(newNoti)
    .subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Notificación guardada'),
      this.limpiarCampos();
    }, error => {
      console.log(error);
    })
  }

  limpiarCampos(){
    this.nuevaNotificacionForm.reset();
  }

}
