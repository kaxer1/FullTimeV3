import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';

interface opcionesDiasHoras {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-registro-empleado-permiso',
  templateUrl: './registro-empleado-permiso.component.html',
  styleUrls: ['./registro-empleado-permiso.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class RegistroEmpleadoPermisoComponent implements OnInit {

  permiso: any = [];
  // Usado para imprimir datos
  datosPermiso: any = [];
  datoNumPermiso: any = [];
  tipoPermisos: any = [];
  diasHoras: opcionesDiasHoras[] = [
    { valor: 'Días', nombre: 'Días' },
    { valor: 'Horas', nombre: 'Horas' },
  ];
  selec1 = false;
  selec2 = false;
  Tdias = 0;
  Thoras;
  num: number;

  // Control de campos y validaciones del formulario
  idPermisoF = new FormControl('', [Validators.required]);
  fecCreacionF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);
  solicitarF = new FormControl('', [Validators.required]);
  diasF = new FormControl('');
  horasF = new FormControl('');
  fechaInicioF = new FormControl('', [Validators.required]);
  fechaFinalF = new FormControl('', [Validators.required]);
  diaLibreF = new FormControl('');
  estadoF = new FormControl('');
  legalizarF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public PermisoForm = new FormGroup({
    idPermisoForm: this.idPermisoF,
    fecCreacionForm: this.fecCreacionF,
    descripcionForm: this.descripcionF,
    solicitarForm: this.solicitarF,
    diasForm: this.diasF,
    horasForm: this.horasF,
    fechaInicioForm: this.fechaInicioF,
    fechaFinalForm: this.fechaFinalF,
    diaLibreForm: this.diaLibreF,
    estadoForm: this.estadoF,
    legalizarForm: this.legalizarF,
  });

  constructor(
    private restTipoP: TipoPermisosService,
    private restP: PermisosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroEmpleadoPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any,
  ) { }

  ngOnInit(): void {
    this.ObtenerTiposPermiso();
    this.ImprimirNumeroPermiso();
  }

  ObtenerTiposPermiso() {
    this.tipoPermisos = [];
    this.restTipoP.getTipoPermisoRest().subscribe(datos => {
      this.tipoPermisos = datos;
    })
  }

  ImprimirNumeroPermiso() {
    this.datoNumPermiso = [];
    this.restP.BuscarNumPermiso(this.datoEmpleado.idEmpleado).subscribe(datos => {
      this.datoNumPermiso = datos;
      if (this.datoNumPermiso[0].max === null) {
        this.num = 1;
      }
      else {
        this.num = this.datoNumPermiso[0].max + 1;
      }
      console.log("numPermiso", this.datoNumPermiso[0].max)
    })
  }

  ImprimirDatos(form) {
    this.selec1 = false;
    this.selec2 = false;
    this.datosPermiso = [];
    this.restTipoP.getOneTipoPermisoRest(form.idPermisoForm).subscribe(datos => {
      this.datosPermiso = datos;
      //console.log("permiso", this.datosPermiso[0]);
      if (this.datosPermiso[0].num_dia_maximo === 0) {
        (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'visible';
        (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'hidden';
        (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'hidden';
        this.PermisoForm.patchValue({
          solicitarForm: 'Horas',
          horasForm: this.datosPermiso[0].num_hora_maximo,
          diasForm: '',
        });
        this.Thoras = this.datosPermiso[0].num_hora_maximo;
        //console.log("hora", this.datosPermiso[0].num_hora_maximo)
      }
      else {
        (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'visible';
        (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'visible';
        (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'hidden';
        this.PermisoForm.patchValue({
          solicitarForm: 'Días',
          diasForm: this.datosPermiso[0].num_dia_maximo,
          horasForm: '',
          diaLibreForm: '',
        });
        this.Tdias = this.datosPermiso[0].num_dia_maximo;
      }
      if (this.datosPermiso[0].legalizar === true) {
        this.selec1 = true;
        this.PermisoForm.patchValue({
          legalizarForm: this.datosPermiso[0].legalizar
        });
      }
      else if (this.datosPermiso[0].legalizar === false) {
        this.selec2 = true;
        this.PermisoForm.patchValue({
          legalizarForm: this.datosPermiso[0].legalizar
        });
      }
    })
  }

  ActivarDiasHoras(form) {
    if (form.solicitarForm === 'Días') {
      this.PermisoForm.patchValue({
        diasForm: '',
      });
      (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'hidden';
      this.toastr.info('Ingresar número de días de permiso');
    }
    else {
      this.PermisoForm.patchValue({
        horasForm: '',
        diaLibreForm: '',
      });
      (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'hidden';
      (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'hidden';
      this.toastr.info('Ingresar número de horas y minutos de permiso');
    }
  }

  CambiarValoresDiasHoras(form, datos) {
    if (form.solicitarForm === 'Días') {
      if (datos.dia === '') {
        this.toastr.info('Ingresar número de días de permiso');
      }
      else {
        datos.hora_numero = '00:00';
      }
    }
    else {
      if (datos.hora_numero === '') {
        this.toastr.info('Ingresar número de horas y minutos máximos de permiso');
      }
      else {
        datos.dia = 0;
      }
    }
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

  InsertarPermiso(form) {
    let datosPermiso = {
      fec_creacion: form.fecCreacionForm,
      descripcion: form.descripcionForm,
      fec_inicio: form.fechaInicioForm,
      fec_final: form.fechaFinalForm,
      dia: parseInt(form.diasForm),
      legalizado: form.legalizarForm,
      estado: form.estadoForm,
      dia_libre: form.diaLibreForm,
      id_tipo_permiso: form.idPermisoForm,
      id_empl_contrato: this.datoEmpleado.idContrato,
      id_peri_vacacion: this.datoEmpleado.idPerVacacion,
      hora_numero: form.horasForm,
      num_permiso: this.num
    }
    console.log(datosPermiso);
    this.CambiarValoresDiasHoras(form, datosPermiso);
    console.log(datosPermiso);
    this.CambiarValorDiaLibre(datosPermiso);
  }

  CambiarValorDiaLibre(datos) {
    if (datos.dia_libre === '') {
      datos.dia_libre = 0;
      this.GuardarDatos(datos);
    }
    else {
      this.GuardarDatos(datos);
    }
  }

  RegistrarPermiso(form) {
    if (Date.parse(form.fechaInicioForm) <= Date.parse(form.fechaFinalForm)) {
      var totalDias = (form.fechaInicioForm.diff(form.fechaFinalForm, 'days')) * (-1);
      //console.log(' dias de diferencia', totalDias);
      if (form.solicitarForm === 'Días') {
        if (totalDias <= this.Tdias || totalDias === 0) {
          if (parseInt(form.diasForm) <= this.Tdias) {
            this.InsertarPermiso(form);
          }
          else {
            this.toastr.info('Los días de permiso deben ser menores o iguales a: ' + String(this.Tdias) + ' día')
          }
        }
        else {
          this.toastr.info('El rango de fechas de salida e ingreso indican más días de los permitidos en el permiso. Por favor revisar las fechas')
        }
      }
      else {
        if (totalDias <= 1 || totalDias === 0) {
          //console.log(' comparando horas', form.horasForm);
          if (form.horasForm <= this.Thoras) {
            this.InsertarPermiso(form);
            console.log('ingresa');
          }
          else {
            this.toastr.info('Las horas de permiso deben ser menores o iguales a: ' + String(this.Thoras) + ' horas')
          }
        }
        else {
          this.toastr.info('El permiso que solicita esta configurado por horas. Por favor revisar las fechas de salida e ingreso')
        }
      }
    }
    else {
      this.toastr.info('La fecha de salida debe ser mayor a la fecha de ingreso')
    }
  }

  idPermisoRes: any;
  GuardarDatos(datos) {
    this.restP.IngresarEmpleadoPermisos(datos).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Permiso registrado');
      this.LimpiarCampos();
      this.idPermisoRes = res;
      console.log(this.idPermisoRes.id);
      this.SubirRespaldo(this.idPermisoRes.id)
      this.ImprimirNumeroPermiso();
    });
  }

  LimpiarCampos() {
    this.PermisoForm.reset();
  }

  CerrarVentanaPermiso() {
    this.LimpiarCampos();
    this.dialogRef.close();
    //window.location.reload();
  }

  ObtenerMensajeErrorDescripcion() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Ingresar una descripción válida';
    }
    return this.descripcionF.hasError('required') ? 'Campo Obligatorio' : '';
  }

  /**
   * 
   * Subida de archivo
   * 
   */

  archivoForm = new FormControl('');
  nameFile: string;
  archivoSubido: Array<File>;

  fileChange(element) {
    this.archivoSubido = element.target.files;
    console.log(element.target.files);
  }

  SubirRespaldo(id: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.restP.SubirArchivoRespaldo(formData, id).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Documento subido con exito');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

}
