import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { NotiAutorizacionesService } from 'src/app/servicios/catalogos/catNotiAutorizaciones/noti-autorizaciones.service';
import { NotificacionesService } from 'src/app/servicios/catalogos/catNotificaciones/notificaciones.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';

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

  // idDocumento = new FormControl('', Validators.required);
  orden = new FormControl('', Validators.required);
  estado = new FormControl('', Validators.required);
  idDepartamento = new FormControl('');

  public nuevaAutorizacionesForm = new FormGroup({
    // idDocumentoF: this.idDocumento,
    ordenF: this.orden,
    estadoF: this.estado,
    idDepartamentoF: this.idDepartamento
  });

  Habilitado: boolean = true;
  notificacion: any = [];
  notiAutrizaciones: any = [];
  departamentos: any = [];

  id_empleado_loggin: number;
  FechaActual: any;
  NotifiRes: any;

  ordenes: Orden[] = [
    { valor: 1 },
    { valor: 2 },
    { valor: 3 },
    { valor: 4 },
    { valor: 5 }
  ];

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  constructor(
    public restAutorizaciones: AutorizacionService,
    // public restNotiAutorizaciones: NotiAutorizacionesService,
    // public restNotificaciones: NotificacionesService,
    public restDepartamento: DepartamentosService,
    public restCargo: EmplCargosService,
    private restP: PermisosService,
    private realTime: RealTimeService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AutorizacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data, 'data');
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    console.log('fecha Actual', this.FechaActual);
    this.obtenerDepartamento();
    this.id_empleado_loggin = parseInt(localStorage.getItem('empleado'));
  }

  insertarAutorizacion(form) {
    var estado_permiso: string;
    let newAutorizaciones = {
      orden: form.ordenF,
      estado: form.estadoF,
      id_departamento: form.idDepartamentoF,
      id_permiso: this.data.id,
      id_vacacion: null,
      id_hora_extra: null,
      id_documento: localStorage.getItem('empleado') + '_' + form.estadoF + ',',
      id_plan_hora_extra: null,
      // id_documento: form.idDocumentoF
    }

    if (this.data.carga === 'multiple') {
      if (newAutorizaciones.estado === 1) {
        estado_permiso = 'Pendiente'
      } else if (newAutorizaciones.estado === 2) {
        estado_permiso = 'Pre-Autorizado'
      } else if (newAutorizaciones.estado === 3) {
        estado_permiso = 'Aceptado'
      } else if (newAutorizaciones.estado === 4) {
        estado_permiso = 'Rechazado'
      }

      this.data.datosPermiso.map(obj => {
        newAutorizaciones.id_permiso = obj.id;
        this.restDepartamento.ConsultarDepartamentoPorContrato(obj.id_contrato).subscribe(res => {
          this.departamentos = res;
          newAutorizaciones.id_departamento = this.departamentos[0].id_departamento;
          console.log(newAutorizaciones, 'kjkjc');
          this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
            console.log(newAutorizaciones, 'entra');
            this.toastr.success('Operación Exitosa', 'Autorizacion guardada');
            console.log(obj.id, this.departamentos[0].id_departamento, obj.id_emple_solicita, estado_permiso)
            this.EditarEstadoPermiso(obj.id, this.departamentos[0].id_departamento, form, obj.id_emple_solicita, estado_permiso)
          }, error => { })
        })
      })
      this.limpiarCampos();
      this.dialogRef.close();
    }
    else {
      console.log(newAutorizaciones);
      this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
        this.toastr.success('Operación Exitosa', 'Autorizacion guardada'),
          this.limpiarCampos();
        this.dialogRef.close();
        window.location.reload();
      }, error => {
        console.log(error);
      })
    }

  }

  obtenerDepartamento() {
    if (this.data.carga === 'multiple') {
      this.nuevaAutorizacionesForm.patchValue({
        ordenF: 1,
        estadoF: 1,
      });
      this.Habilitado = false;
    }
    else {
      this.restDepartamento.ConsultarDepartamentoPorContrato(this.data.id_contrato).subscribe(res => {
        console.log(res);
        this.departamentos = res;
        this.nuevaAutorizacionesForm.patchValue({
          ordenF: 1,
          estadoF: 1,
          idDepartamentoF: this.departamentos[0].id_departamento
        })
      })
    }
  }

  resEstado: any = [];
  idNoti: any = [];
  EditarEstadoPermiso(id_permiso, id_departamento, form, id_empleado, estado_permiso) {
    let datosPermiso = {
      estado: estado_permiso,
      id_permiso: id_permiso,
      id_departamento: id_departamento,
      id_empleado: id_empleado
    }

    this.restP.ActualizarEstado(id_permiso, datosPermiso).subscribe(respo => {
      this.resEstado = [respo];
      console.log(this.resEstado);
      console.log('estado')
      var f = new Date();
      let notificacion = {
        id: null,
        id_send_empl: this.id_empleado_loggin,
        id_receives_empl: id_empleado,
        id_receives_depa: id_departamento,
        estado:  form.estadoF,
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`,
        id_permiso: id_permiso,
        id_vacaciones: null
      }
      console.log(notificacion, 'entra');

      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res => {
        console.log(res);
        this.NotifiRes = res;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0 && this.resEstado[0].notificacion === true) {
          this.restP.sendNotiRealTime(notificacion);
        }
      });
      this.dialogRef.close();
      //window.location.reload();
    });
  }

  limpiarCampos() {
    this.nuevaAutorizacionesForm.reset();
  }

  CerrarVentanaRegistroNoti() {
    this.limpiarCampos();
    this.dialogRef.close();
  }

}
