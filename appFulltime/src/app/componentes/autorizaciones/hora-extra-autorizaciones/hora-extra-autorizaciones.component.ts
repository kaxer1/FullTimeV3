import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
//moment.locale('es');
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

interface Orden {
  valor: number
}

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-hora-extra-autorizaciones',
  templateUrl: './hora-extra-autorizaciones.component.html',
  styleUrls: ['./hora-extra-autorizaciones.component.css']
})

export class HoraExtraAutorizacionesComponent implements OnInit {

  idDocumento = new FormControl('', Validators.required);
  TipoDocumento = new FormControl('');
  orden = new FormControl('', Validators.required);
  estado = new FormControl('', Validators.required);
  idDepartamento = new FormControl('');

  public nuevaAutorizacionesForm = new FormGroup({
    idDocumentoF: this.idDocumento,
    ordenF: this.orden,
    estadoF: this.estado,
    idDepartamentoF: this.idDepartamento
  });

  departamentos: any = [];

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

  Habilitado: boolean = true;
  id_empleado_loggin: number;
  FechaActual: any;
  NotifiRes: any;

  constructor(
    public restAutorizaciones: AutorizacionService,
    public restDepartamento: DepartamentosService,
    private realTime: RealTimeService,
    private restH: PedHoraExtraService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<HoraExtraAutorizacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id_empleado_loggin = parseInt(localStorage.getItem('empleado'));
   }

  ngOnInit(): void {
    console.log(this.data, 'data');
    this.obtenerDepartamento();
    this.tiempo();
  }

  insertarAutorizacion(form) {
    let newAutorizaciones = {
      orden: form.ordenF,
      estado: form.estadoF,
      id_departamento: form.idDepartamentoF,
      id_permiso: null,
      id_vacacion: null,
      id_hora_extra: this.data.id,
      id_plan_hora_extra: null,
      id_documento: form.idDocumentoF
    }
    if (this.data.carga === 'individual') {
      newAutorizaciones.id_hora_extra = this.data.datosHora.id;
      this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
        this.toastr.success('Operación Exitosa', 'Autorizacion guardada'),
          this.limpiarCampos();
        this.dialogRef.close();
      }, error => {
        console.log(error);
      })
    }
    else if (this.data.carga === 'multiple') {
      console.log('entra');
      console.log(newAutorizaciones);
      /*  for (var i = 0; i < this.data.datosHora.length  ; i++) {
          console.log('i', i, ' ', this.data.datosHora.length - 1, this.data.datosHora.length);
          newAutorizaciones.id_hora_extra = this.data.datosHora[i].id;
          console.log('ejecuta 1', i);
          this.restDepartamento.ConsultarDepartamentoPorContrato(this.data.datosHora[i].id_contrato).subscribe(res => {
           
            this.departamentos = res;
            console.log('ejecuta 2', i);
            newAutorizaciones.id_departamento = this.departamentos[0].id_departamento;
            console.log(newAutorizaciones, 'kjkjc', i);
            this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
              this.toastr.success('Operación Exitosa', 'Autorizacion guardada');
              console.log(this.data.datosHora[i].id, this.departamentos[0].id_departamento, this.data.datosHora[i].id_usua_solicita, form.estadoF)
              this.EditarEstadoHoraExtra(this.data.datosHora[i].id, this.departamentos[0].id_departamento, this.data.datosHora[i].id_usua_solicita, form.estadoF)
            }, error => { })
          })
          console.log('i', i)
        }*/

      this.data.datosHora.map(obj => {
        // console.log('i', i, ' ', this.data.datosHora.length - 1, this.data.datosHora.length);
        newAutorizaciones.id_hora_extra = obj.id;
        //console.log('ejecuta 1', i);
        this.restDepartamento.ConsultarDepartamentoPorContrato(obj.id_contrato).subscribe(res => {

          this.departamentos = res;
          //console.log('ejecuta 2', i);
          newAutorizaciones.id_departamento = this.departamentos[0].id_departamento;
          console.log(newAutorizaciones, 'kjkjc');
          this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
            this.toastr.success('Operación Exitosa', 'Autorizacion guardada');
            console.log(obj.id, this.departamentos[0].id_departamento, obj.id_usua_solicita, form.estadoF)
            this.EditarEstadoHoraExtra(obj.id, this.departamentos[0].id_departamento, obj.id_usua_solicita, form.estadoF)
          }, error => { })
        })
      })

      this.limpiarCampos();
      this.dialogRef.close();
    }
    else {
      this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
        this.toastr.success('Operación Exitosa', 'Autorizacion guardada'),
          this.limpiarCampos();
        this.dialogRef.close();
      }, error => {
        console.log(error);
      })
    }
  }

  obtenerDepartamento() {
    if (this.data.carga != 'individual' && this.data.carga != 'multiple') {
      this.BusquedaDepartamento(this.data.id_contrato);
    }
    else {
      this.nuevaAutorizacionesForm.patchValue({
        ordenF: 1,
        estadoF: 1,
      })
      this.Habilitado = false;
    }
  }

  BusquedaDepartamento(contrato_id) {
    this.restDepartamento.ConsultarDepartamentoPorContrato(contrato_id).subscribe(res => {
      console.log(res);
      this.departamentos = res;
      this.nuevaAutorizacionesForm.patchValue({
        ordenF: 1,
        estadoF: 1,
        idDepartamentoF: this.departamentos[0].id_departamento
      })
    })
  }

  tiempo() {
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    console.log('fecha Actual', this.FechaActual);
  }

  resEstado: any = [];
  EditarEstadoHoraExtra(id_hora, id_departamento, usuario_solicita, estado_hora) {
    let datosHorasExtras = {
      estado: estado_hora,
      id_hora_extra: id_hora,
      id_departamento: id_departamento,
    }
    console.log('datos', datosHorasExtras);
    this.restH.ActualizarEstado(id_hora, datosHorasExtras).subscribe(res => {
      this.resEstado = [res];
      console.log('estado', this.resEstado);
      console.log(this.resEstado[0].realtime[0].estado);
      var f = new Date();
      // let nomEstado = '';
      // this.estados.forEach(obj => {
      //   if(obj.valor = form.estadoForm) {
      //     nomEstado = obj.nombre
      //   }
      // })
      let notificacion = {
        id: null,
        id_send_empl: this.id_empleado_loggin,
        id_receives_empl: usuario_solicita,
        id_receives_depa: id_departamento,
        estado: this.resEstado[0].realtime[0].estado,
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`,
        id_permiso: null,
        id_vacaciones: null,
        id_hora_extra: id_hora
      }
      console.log('noti', notificacion, this.id_empleado_loggin);

      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res1 => {
        console.log(res1);
        this.NotifiRes = res1;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0 && this.resEstado[0].notificacion === true) {
          this.restH.sendNotiRealTime(notificacion);
        }
      });
    })
  }

  limpiarCampos() {
    this.nuevaAutorizacionesForm.reset();
  }

}
