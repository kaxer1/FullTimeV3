import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';

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

  // Control de campos y validaciones del formulario
  fechaSolicitudF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required]);
  fechaInicioF = new FormControl('', [Validators.required]);
  FechaFinF = new FormControl('', [Validators.required]);
  horaInicioF = new FormControl('');
  nombreEmpleadoF = new FormControl('');
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
    nombreEmpleadoForm: this.nombreEmpleadoF,
    horaFinForm: this.horaFinF,
    horasForm: this.horaInicioF,
    estadoForm: this.estadoF,
    funcionForm: this.funcionF
  });

  FechaActual: any;

  constructor(
    private rest: TipoPermisosService,
    private toastr: ToastrService,
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
    this.PedirHoraExtraForm.patchValue({
      fechaSolicitudForm: this.FechaActual,
    });
  }

  insertarTipoPermiso(form1) {
    let dataPedirHoraExtra = {
      id_empl_cargo: form1.nombreEmpleadoForm,
      id_usua_solicita: 1,
      fec_inicio: form1.fechaInicioForm,
      fec_final: form1.FechaFinForm,
      fec_solicita: form1.fechaSolicitudForm,
      num_hora: form1.horasForm,
      descripcion: form1.descripcionForm,
      estado: form1.estadoForm,
      tipo_funcion: form1.funcionForm
    }

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
