import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { PlanHoraExtraService } from 'src/app/servicios/planHoraExtra/plan-hora-extra.service';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-plan-hora-extra',
  templateUrl: './plan-hora-extra.component.html',
  styleUrls: ['./plan-hora-extra.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class PlanHoraExtraComponent implements OnInit {

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  // Control de campos y validaciones del formulario
  fechaSolicitudF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required]);
  fechaInicioF = new FormControl('', [Validators.required]);
  FechaFinF = new FormControl('', [Validators.required]);
  horaInicioF = new FormControl('');
  horaFinF = new FormControl('', [Validators.required]);
  horasF = new FormControl('', [Validators.required]);
  estadoF = new FormControl('', [Validators.required]);
  funcionF = new FormControl('', [Validators.required]);

  public PedirHoraExtraForm = new FormGroup({
    fechaSolicitudForm: this.fechaSolicitudF,
    descripcionForm: this.descripcionF,
    fechaInicioForm: this.fechaInicioF,
    FechaFinForm: this.FechaFinF,
    horaInicioForm: this.horaInicioF,
    horaFinForm: this.horaFinF,
    horasForm: this.horasF,
    estadoForm: this.estadoF,
    funcionForm: this.funcionF
  });

  FechaActual: any;
  id_user_loggin: number;
  id_cargo_loggin: number;

  constructor(
    private rest: TipoPermisosService,
    private restPE: PlanHoraExtraService,
    private toastr: ToastrService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<PlanHoraExtraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
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
    this.id_user_loggin = parseInt(localStorage.getItem("empleado"));
    this.id_cargo_loggin = parseInt(localStorage.getItem("ultimoCargo"));

    this.PedirHoraExtraForm.patchValue({
      fechaSolicitudForm: this.FechaActual,
    });
  }

  HoraExtraResponse: any;
  NotifiRes: any;
  arrayNivelesDepa: any = [];

  datosSeleccionados: any = [];
  insertarPlanificacion(form1) {
    this.datosSeleccionados = [];
    this.datosSeleccionados = this.data.planifica;
    let dataPlanHoraExtra = {
      id_empl_planifica: this.id_user_loggin,
      id_empl_realiza: 0,
      fecha_desde: form1.fechaInicioForm,
      fecha_hasta: form1.FechaFinForm,
      hora_inicio: form1.horaInicioForm,
      hora_fin: form1.horaFinForm,
      descripcion: form1.descripcionForm,
      horas_totales: form1.horasForm,
      estado: form1.estadoForm,
    }
    if (this.datosSeleccionados.length != undefined) {
      console.log('probando', this.datosSeleccionados, this.datosSeleccionados.length - 1, this.datosSeleccionados.length)
      for (var i = 0; i < this.datosSeleccionados.length; i++) {
        console.log('entra 21')
        dataPlanHoraExtra.id_empl_realiza = this.datosSeleccionados[i].id;
        this.restPE.CrearPlanificacionHoraExtra(dataPlanHoraExtra).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Horas Extras planificadas');
        })
      }
    }
    else {
      dataPlanHoraExtra.id_empl_realiza = this.data.planifica.id;
      this.restPE.CrearPlanificacionHoraExtra(dataPlanHoraExtra).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Horas Extras planificadas');
      })
    }


    this.dialogRef.close();

    /*  this.arrayNivelesDepa = response;
      console.log(this.arrayNivelesDepa);
      this.arrayNivelesDepa.forEach(obj => {
 
        let datosHoraExtraCreada = {
          //id_empl_cargo: dataPedirHoraExtra.id_empl_cargo,
          // id_usua_solicita: dataPedirHoraExtra.id_usua_solicita,
          //fec_inicio: dataPedirHoraExtra.fec_inicio,
          //fec_final: dataPedirHoraExtra.fec_final,
          // fec_solicita: dataPedirHoraExtra.fec_solicita,
          id: obj.id,
          estado: obj.estado,
          id_dep: obj.id_dep,
          depa_padre: obj.depa_padre,
          nivel: obj.nivel,
          id_suc: obj.id_suc,
          departamento: obj.departamento,
          sucursal: obj.sucursal,
          cargo: obj.cargo,
          contrato: obj.contrato,
          empleado: obj.empleado,
          nombre: obj.nombre,
          apellido: obj.apellido,
          cedula: obj.cedula,
          correo: obj.correo,
          hora_extra_mail: obj.hora_extra_mail,
          hora_extra_noti: obj.hora_extra_noti
        }
 
          this.restHE.SendMailNoti(datosHoraExtraCreada).subscribe(res => {
             this.HoraExtraResponse = res;
             console.log(this.HoraExtraResponse);
             var f = new Date();
             let notificacion = {
               id: null,
               id_send_empl: this.id_user_loggin,
               id_receives_empl: this.HoraExtraResponse.id_empleado_autoriza,
               id_receives_depa: this.HoraExtraResponse.id_departamento_autoriza,
               estado: this.HoraExtraResponse.estado,
               create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`,
               id_permiso: null,
               id_vacaciones: null,
               id_hora_extra: this.HoraExtraResponse.id
             }
   
             this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(resN => {
               console.log(resN);
               this.NotifiRes = resN;
               notificacion.id = this.NotifiRes._id;
               if (this.NotifiRes._id > 0 && this.HoraExtraResponse.notificacion === true) {
                 this.restHE.sendNotiRealTime(notificacion);
               }
             });
   
           })

  });*/



  }

  IngresarDatos(datos) {
    this.rest.postTipoPermisoRest(datos).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Tipo Permiso guardado');
      window.location.reload();
    }, error => {
    });
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
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

  CalcularTiempo(form) {
    this.PedirHoraExtraForm.patchValue({ horasForm: '' })
    if (form.horaInicioForm != '' && form.horaFinForm != '') {
      console.log('revisando horas', form.horaInicioForm, form.horaFinForm)
      var hora1 = (String(form.horaInicioForm) + ':00').split(":"),
        hora2 = (String(form.horaFinForm) + ':00').split(":"),
        t1 = new Date(),
        t2 = new Date();
      t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
      t2.setHours(parseInt(hora2[0]), parseInt(hora2[1]), parseInt(hora2[2]));
      //Aquí hago la resta
      t1.setHours(t2.getHours() - t1.getHours(), t2.getMinutes() - t1.getMinutes(), t2.getSeconds() - t1.getSeconds());
      if (t1.getHours() < 10 && t1.getMinutes() < 10) {
        var tiempoTotal: string = '0' + t1.getHours() + ':' + '0' + t1.getMinutes();
        this.PedirHoraExtraForm.patchValue({ horasForm: tiempoTotal })
      }
      else if (t1.getHours() < 10) {
        var tiempoTotal: string = '0' + t1.getHours() + ':' + t1.getMinutes();
        this.PedirHoraExtraForm.patchValue({ horasForm: tiempoTotal })
      }
      else if (t1.getMinutes() < 10) {
        var tiempoTotal: string = t1.getHours() + ':' + '0' + t1.getMinutes();
        this.PedirHoraExtraForm.patchValue({ horasForm: tiempoTotal })
      }
    }
    else {
      this.toastr.info('Debe ingresar la hora de inicio y la hora de fin de actividades.', 'VERIFICAR')
    }
  }

  LimpiarCampoHoras() {
    this.PedirHoraExtraForm.patchValue({ horasForm: '' })
  }

}
