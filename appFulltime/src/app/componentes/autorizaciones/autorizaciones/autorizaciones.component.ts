import { Component, OnInit } from '@angular/core';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NotiAutorizacionesService } from 'src/app/servicios/catalogos/catNotiAutorizaciones/noti-autorizaciones.service';
import { NotificacionesService } from 'src/app/servicios/catalogos/catNotificaciones/notificaciones.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';

interface Orden {
  valor: number
}

interface Estado {
  id: number,
  nombre: string
}

interface Documento {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-autorizaciones',
  templateUrl: './autorizaciones.component.html',
  styleUrls: ['./autorizaciones.component.css']
})
export class AutorizacionesComponent implements OnInit {

  idDocumento = new FormControl('', Validators.required);
  TipoDocumento = new FormControl('', Validators.required);
  orden = new FormControl('', Validators.required);
  estado = new FormControl('', Validators.required);
  idCatNotificacion = new FormControl('', Validators.required);
  idCatNotiAutorizacion = new FormControl('', Validators.required);
  idDepartamento = new FormControl('', Validators.required);

  public nuevaAutorizacionesForm = new FormGroup({
    idDocumentoF: this.idDocumento,
    tipoDocumentoF: this.TipoDocumento, 
    ordenF: this.orden, 
    estadoF: this.estado, 
    idNotificacionF: this.idCatNotificacion, 
    idNotiAutorizacionF: this.idCatNotiAutorizacion, 
    idDepartamentoF: this.idDepartamento
  });

  notificacion: any = [];
  notiAutrizaciones: any = [];
  departamentos: any = [];

  ordenes: Orden[] = [
    { valor: 0},
    { valor: 1},
    { valor: 2},
    { valor: 3},
    { valor: 4},
    { valor: 5}
  ];

  estados: Estado[] = [
    { id: 1, nombre: 'activo'},
    { id: 2, nombre: 'inactivo'},
  ];

  tipoDoc: Documento[] = [
    { id: 1, nombre: 'doc1'},
    { id: 2, nombre: 'doc2'},
    { id: 3, nombre: 'doc3'},
  ]

  idDoc: Documento[] = [
    { id: 1, nombre: 'idDoc1'},
    { id: 2, nombre: 'idDoc2'},
    { id: 3, nombre: 'idDoc3'},
  ]  
  
  constructor(
    public restAutorizaciones: AutorizacionService,
    public restNotiAutorizaciones: NotiAutorizacionesService,
    public restNotificaciones: NotificacionesService,
    public restDepartamento: DepartamentosService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerDepartamento();
    this.obtenerNotiAutorizaciones();
    this.obtenerNotificacion();
  }

  insertarAutorizacion(form){
    let newAutorizaciones = {
      id_documento: form.idDocumentoF,
      tipo_documento: form.tipoDocumentoF, 
      orden: form.ordenF, 
      estado: form.estadoF, 
      id_notificacion: form.idNotiAutorizacionF, 
      id_noti_autorizacion: form.idNotiAutorizacionF, 
      id_departamento: form.idDepartamentoF
    }
    console.log(newAutorizaciones);
    this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Autorizacion guardada'),
      this.limpiarCampos();
    }, error => {
      console.log(error);
    })
  }

  obtenerNotificacion(){
    this.restNotificaciones.getNotificacionesRest().subscribe(res => {
      console.log(res);
      this.notificacion = res;
    });
  }

  obtenerNotiAutorizaciones(){
    this.restNotiAutorizaciones.getNotiAutoriRest().subscribe(res => {
      console.log(res);
      this.notiAutrizaciones = res;
    });
  }

  obtenerDepartamento(){
    this.restDepartamento.ConsultarDepartamentos().subscribe(res => {
      console.log(res);
      this.departamentos = res;
    });
  }

  limpiarCampos(){
    this.nuevaAutorizacionesForm.reset();
  }

}
