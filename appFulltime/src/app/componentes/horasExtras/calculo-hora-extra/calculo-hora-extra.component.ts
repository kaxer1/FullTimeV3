import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { HorasExtrasService } from 'src/app/servicios/catalogos/catHorasExtras/horas-extras.service';

interface tipoDia {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-calculo-hora-extra',
  templateUrl: './calculo-hora-extra.component.html',
  styleUrls: ['./calculo-hora-extra.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class CalculoHoraExtraComponent implements OnInit {

  // Control de campos y validaciones del formulario

  nombreEmpleadoF = new FormControl('');
  seleccionarHoraF = new FormControl('', [Validators.required]);
  horaInicioF = new FormControl('');
  horaFinF = new FormControl('', [Validators.required]);
  horaInicioTF = new FormControl('');
  horaFinTF = new FormControl('', [Validators.required]);
  horasF = new FormControl('', [Validators.required]);
  horasRealesF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('', [Validators.required]);
  horasPermisoF = new FormControl('', [Validators.required]);
  estadoF = new FormControl('', [Validators.required]);
  fechaRealizadasF = new FormControl('', [Validators.required]);

  public PedirHoraExtraForm = new FormGroup({
    nombreEmpleadoForm: this.nombreEmpleadoF,
    seleccionarHoraForm: this.seleccionarHoraF,
    horaInicioForm: this.horaInicioF,
    horaFinForm: this.horaFinF,
    horaInicioTForm: this.horaInicioTF,
    horaFinTForm: this.horaFinTF,
    horasForm: this.horasF,
    horasRealesForm: this.horasRealesF,
    tipoForm: this.tipoF,
    horasPermisoForm: this.horasPermisoF,
    estadoForm: this.estadoF,
    fechaRealizadasForm: this.fechaRealizadasF
  });

  FechaActual: any;
  horasExtras: any = [];
  tipoD: tipoDia[] = [
    { value: 1, viewValue: 'Normal' },
    { value: 2, viewValue: 'Libre' },
    { value: 3, viewValue: 'Feriado' }
  ];

  constructor(
    private rest: HorasExtrasService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerHorasExtras();
  }

  ObtenerHorasExtras() {
    this.horasExtras = [];
    this.rest.ListarHorasExtras().subscribe(datos => {
      this.horasExtras = datos;
    }, error => {
      this.toastr.info('Registros no encontrados','', {
        timeOut: 6000,
      })
    });
  }

  insertarTipoPermiso(form) {
    let dataHoraExtra = {
      id_hora_extr_pedido: 1,
      id_empl_cargo: 1,
      id_usuario: 1,
      estado: form.estadoForm,
      id_hora_extra: form.seleccionarHoraForm,
      hora_ini_planificacion: form.horaInicioForm,
      hora_fin_planificacion: form.horaFinForm,
      hora_ini_timbre: form.horaInicioTForm,
      hora_fin_timbre: form.horaFinTForm,
      hora_numero: form.horasRealesForm,
      hora_limite:form.horasForm,
      fecha: form.fechaRealizadasForm,
      tipo_dia: form.tipoForm,
      id_horario: 1,
      hora_permiso: form.horasPermisoForm
    }

  }

  IngresarDatos(datos) {
    /* this.rest.postTipoPermisoRest(datos).subscribe(res => {
       this.toastr.success('Operación Exitosa', 'Tipo Permiso guardado', {
        timeOut: 6000,
      });
       window.location.reload();
     }, error => {
     });*/
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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

}
