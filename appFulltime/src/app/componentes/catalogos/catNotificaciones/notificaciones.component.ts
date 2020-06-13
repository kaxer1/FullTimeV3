import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { NotificacionesService } from 'src/app/servicios/catalogos/catNotificaciones/notificaciones.service';
import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';

interface Nivel {
  valor: string
}

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class NotificacionesComponent implements OnInit {

  departamentos: any = [];
  depa_filtrado: any = [];
  noti_filtrado: any = [];
  tipoPermiso: any = [];

  tipo = new FormControl('');
  nivel = new FormControl('', Validators.required);
  idDepartamento = new FormControl('', Validators.required);
  idTipoPermiso = new FormControl('', Validators.required);

  public nuevaNotificacionForm = new FormGroup({
    tipoForm: this.tipo,
    nivelForm: this.nivel,
    idDepartamentoForm: this.idDepartamento,
    idTipoPermisoForm: this.idTipoPermiso
  });

  niveles: Nivel[] = [    
    { valor: '1'},
    { valor: '2'},
    { valor: '3'},
    { valor: '4'},
    { valor: '5'}
  ];

  HabilitarD: boolean = false;
  HabilitarP: boolean = false;

  constructor(
    private toastr: ToastrService,
    private rest: NotificacionesService,
    private restD: DepartamentosService,
    private restP: TipoPermisosService
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
    this.rest.getNotificacionesRest().subscribe(res => {
      this.noti_filtrado = res;
      console.log(res);
    })
  }

  ListaDepartamentos() {
    this.HabilitarD = true;
    this.departamentos = []
    this.restD.ConsultarDepartamentos().subscribe(datos => {
      this.departamentos = datos;
      // this.depa_filtrado = datos;
      // this.depa_filtrado.forEach(obj => {
      //   console.log(obj);
      // });
    })
  }

  ObtenerTipoPermiso() {
    this.HabilitarP = true;
    this.restP.getTipoPermisoRest().subscribe(datos => {
      this.tipoPermiso = datos;
      console.log(this.tipoPermiso);
    }, error => {
    });
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  ObtenerMensajeErrorTipoRequerido() {
    if (this.tipo.hasError('required')) {
      return 'Campo obligatorio';
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
