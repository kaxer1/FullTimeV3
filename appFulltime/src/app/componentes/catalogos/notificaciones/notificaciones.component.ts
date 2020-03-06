import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificacionesService } from 'src/app/servicios/catalogos/notificaciones.service';

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
