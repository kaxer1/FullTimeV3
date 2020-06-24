import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { NotificacionesService } from 'src/app/servicios/catalogos/catNotificaciones/notificaciones.service';
import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditarNotificacionComponent } from './editar-notificacion/editar-notificacion.component';
import { NotiAutorizacionesComponent } from "../catNotiAutorizaciones/Registro/noti-autorizaciones/noti-autorizaciones.component";
import { ListarNotiAutorizacionesComponent } from '../catNotiAutorizaciones/listar/listar-noti-autorizaciones/listar-noti-autorizaciones.component';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';

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
  tipoPermiso: any = [];

  tipo = new FormControl('');
  nivel = new FormControl('', Validators.required);
  idDepartamento = new FormControl('', Validators.required);
  idTipoPermiso = new FormControl('', Validators.required);
  sucursal = new FormControl('', Validators.required);

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
  HabilitarS: boolean = false;

  tipo_permiso_res: any = [];
  noti_res: any = [];
  depa_res: any = [];
  sucu_res: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private toastr: ToastrService,
    private rest: NotificacionesService,
    private restD: DepartamentosService,
    private restP: TipoPermisosService,
    private restS: SucursalService,
    public vistaRegistrarDatos: MatDialog
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
    this.rest.getNotificacionesRest().subscribe(res => {
      this.noti_res = res;
    });
    this.restS.getSucursalesRest().subscribe(res => {
      this.sucu_res = res;
    });
    this.restP.getTipoPermisoRest().subscribe(res => {
      this.tipo_permiso_res = res;
    });
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ActivarFormSucursal(){
    this.HabilitarS = true;
  }

  ActivarFormDepa(id_sucursal: number){
    this.departamentos = [];
    this.HabilitarD = true;
    this.restD.BuscarDepartamentoSucursal(id_sucursal).subscribe(res => {
      this.departamentos = res;
    }, error => {
      this.toastr.info('Selecciones otra sucursal que contenga departamentos', 'Sucursal sin departamentos');
      this.sucursal.setValue('')
    });
  }
  
  // depa_Asignado: any = [];
  // ListaDepartamentos() {
  //   this.departamentos = [];
  //   this.depa_Asignado = [];
  //   this.restD.ConsultarDepartamentos().subscribe(datos => {
  //     this.departamentos = datos;
  //     this.depa_filtrado = datos;
  //     this.noti_filtrado.forEach(elm => {
  //       this.depa_Asignado.push(elm.nombre);
  //     });
  //     console.log(this.depa_Asignado)
  //     this.depa_filtrado.forEach(obj => {
  //       if(this.depa_Asignado.indexOf(obj.nombre) < 0){
  //         console.log(obj.nombre);
  //         let dataDepa = {
  //           id: obj.id,
  //           nombre: obj.nombre,
  //         }
  //         this.departamentos.push(dataDepa);
  //       }
  //     });
  //   });
  // }

  tipo_permiso_Asignado: any = [];
  ObtenerTipoPermiso(id_depa) {
    this.HabilitarP = true;
    this.tipoPermiso = []
    this.tipo_permiso_Asignado = [];
    this.noti_res.forEach(elm => {
      if (id_depa == elm.departamento){
        this.tipo_permiso_Asignado.push(elm.descripcion);
      }
    });
    // console.log(this.tipo_permiso_Asignado);
    this.tipo_permiso_res.forEach(element=> {
      if(this.tipo_permiso_Asignado.indexOf(element.descripcion) < 0){
        let dataTipoPermiso = {
          id: element.id,
          descripcion: element.descripcion,
        }
        this.tipoPermiso.push(dataTipoPermiso);
      }
    });
    // console.log(this.tipoPermiso);
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
    this.rest.postNotificacionesRest(newNoti).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Notificación guardada'),
      this.limpiarCampos();
      this.rest.getNotificacionesRest().subscribe(res => {
        this.noti_res = res;
      });
    }, error => {
      console.log(error);
    })
  }

  limpiarCampos(){
    this.nuevaNotificacionForm.reset();
  }

  EditarNotificacion(datosSeleccionados: any): void {
    this.vistaRegistrarDatos.open(EditarNotificacionComponent, { width: '450px', data: datosSeleccionados }).disableClose = true;
  }

  AbrirNotificacionAutorizacion(datosSeleccionados: any): void {
    this.vistaRegistrarDatos.open(NotiAutorizacionesComponent, { width: '300px', data: datosSeleccionados }).disableClose = true;
  }
  
  AbrirListaNotificacionAutorizacion(datosSeleccionados: any): void {
    this.vistaRegistrarDatos.open(ListarNotiAutorizacionesComponent, { width: '400px', data: datosSeleccionados }).disableClose = true;
  }
}
