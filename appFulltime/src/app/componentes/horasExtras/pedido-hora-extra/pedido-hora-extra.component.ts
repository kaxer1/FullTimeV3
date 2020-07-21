import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';
import { MatDialogRef } from '@angular/material/dialog';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-pedido-hora-extra',
  templateUrl: './pedido-hora-extra.component.html',
  styleUrls: ['./pedido-hora-extra.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class PedidoHoraExtraComponent implements OnInit {

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
    private restHE: PedHoraExtraService,
    private toastr: ToastrService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<PedidoHoraExtraComponent>,
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
  insertarTipoPermiso(form1) {
    let horaI = form1.fechaInicioForm._i.year + "/" + form1.fechaInicioForm._i.month + "/" + form1.fechaInicioForm._i.date + "T" + form1.horaInicioForm + ":00"
    let horaF = form1.FechaFinForm._i.year + "/" + form1.FechaFinForm._i.month + "/" + form1.FechaFinForm._i.date + "T" + form1.horaFinForm + ":00"

    let dataPedirHoraExtra = {
      id_empl_cargo: this.id_cargo_loggin,
      id_usua_solicita: this.id_user_loggin,
      fec_inicio: horaI,
      fec_final: horaF,
      fec_solicita: form1.fechaSolicitudForm,
      num_hora: form1.horasForm + ":00",
      descripcion: form1.descripcionForm,
      estado: form1.estadoForm,
      tipo_funcion: form1.funcionForm
    }

    this.restHE.GuardarHoraExtra(dataPedirHoraExtra).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Tipo Permiso guardado');
      this.dialogRef.close()
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
      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res => {
        console.log(res);
        this.NotifiRes = res;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0 && this.HoraExtraResponse.notificacion === true) {
          this.restHE.sendNotiRealTime(notificacion);
        }
      });
    });
    
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

}
