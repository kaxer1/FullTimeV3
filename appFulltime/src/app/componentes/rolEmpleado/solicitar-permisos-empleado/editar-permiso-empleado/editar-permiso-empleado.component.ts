import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/servicios/login/login.service';
import * as moment from 'moment';

interface opcionesDiasHoras {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-editar-permiso-empleado',
  templateUrl: './editar-permiso-empleado.component.html',
  styleUrls: ['./editar-permiso-empleado.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class EditarPermisoEmpleadoComponent implements OnInit {

  permiso: any = [];
  // Usado para imprimir datos
  datosPermiso: any = [];
  datoNumPermiso: any = [];
  tipoPermisos: any = [];
  diasHoras: opcionesDiasHoras[] = [
    { valor: 'Días', nombre: 'Días' },
    { valor: 'Horas', nombre: 'Horas' },
    { valor: 'Días y Horas', nombre: 'Días y Horas' },
  ];
  Tdias = 0;
  Thoras;
  num: number;
  tipoPermisoSelec: string;
  horasTrabajo: any = [];
  isChecked: boolean = false;

  HabilitarDias: boolean = true;
  estiloDias: any;
  HabilitarHoras: boolean = true;
  estiloHoras: any;
  HabilitarDiasL: boolean = true;
  estiloDiasL: any;

  // Control de campos y validaciones del formulario
  idPermisoF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);
  solicitarF = new FormControl('', [Validators.required]);
  diasF = new FormControl('');
  horasF = new FormControl('');
  fechaInicioF = new FormControl('', [Validators.required]);
  fechaFinalF = new FormControl('', [Validators.required]);
  diaLibreF = new FormControl('');
  nombreCertificadoF = new FormControl('');
  archivoForm = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public PermisoForm = new FormGroup({
    idPermisoForm: this.idPermisoF,
    descripcionForm: this.descripcionF,
    solicitarForm: this.solicitarF,
    diasForm: this.diasF,
    horasForm: this.horasF,
    fechaInicioForm: this.fechaInicioF,
    fechaFinalForm: this.fechaFinalF,
    diaLibreForm: this.diaLibreF,
    nombreCertificadoForm: this.nombreCertificadoF
  });

  constructor(
    private restTipoP: TipoPermisosService,
    private restP: PermisosService,
    private restH: EmpleadoHorariosService,
    private toastr: ToastrService,
    private loginServise: LoginService,
    public dialogRef: MatDialogRef<EditarPermisoEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) { }

  ngOnInit(): void {
    console.log(this.datos);
    this.num = this.datos.num_permiso
    this.ObtenerTiposPermiso();
    this.SettingData();
    this.comparacionSolicitud();
  }

  comparacionSolicitud() {
    if (this.datos.dia > 0 && this.datos.hora_numero === '00:00:00') {
      this.PermisoForm.patchValue({ solicitarForm: 'Días' });
    } else if (this.datos.dia > 0 && this.datos.hora_numero != '00:00:00') {
      this.PermisoForm.patchValue({ solicitarForm: 'Días y Horas' });
    } else if (this.datos.dia === 0 && this.datos.hora_numero != '00:00:00') {
      this.PermisoForm.patchValue({ solicitarForm: 'Horas' });
    }
  }

  SettingData() {
    this.PermisoForm.patchValue({
      idPermisoForm: this.datos.id_tipo_permiso,
      descripcionForm: this.datos.descripcion,
      diasForm: this.datos.dia,
      horasForm: this.datos.hora_numero,
      fechaInicioForm: this.datos.fec_inicio,
      fechaFinalForm: this.datos.fec_final,
      diaLibreForm: this.datos.dia_libre,
      nombreCertificadoForm: this.datos.docu_nombre
    });
    if (this.datos.dia === 0) {
      this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras = false;
      this.estiloDias = { 'visibility': 'hidden' }; this.HabilitarDias = true;
      this.estiloDiasL = { 'visibility': 'hidden' }; this.HabilitarDiasL = true;
      this.tipoPermisoSelec = 'Horas';
      this.PermisoForm.patchValue({
        solicitarForm: 'Horas',
      });
    }
    else if (this.datos.hora_numero === '00:00:00') {
      this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
      this.estiloDiasL = { 'visibility': 'visible' }; this.HabilitarDiasL = false;
      this.estiloHoras = { 'visibility': 'hidden' }; this.HabilitarHoras = true;
      this.tipoPermisoSelec = 'Días';
      this.PermisoForm.patchValue({
        solicitarForm: 'Días',
      });
    }
    else {
      this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
      this.estiloDiasL = { 'visibility': 'visible' }; this.HabilitarDiasL = false;
      this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras = false;
      this.tipoPermisoSelec = 'Días y Horas';
      this.PermisoForm.patchValue({
        solicitarForm: 'Días y Horas',
      });
    }
    // if (this.datos.legalizado === true) {
    //   this.selec1 = true;
    // }
    // else if (this.datos.legalizado === false) {
    //   this.selec2 = true;
    // }
  }

  ObtenerTiposPermiso() {
    this.tipoPermisos = [];
    let rol = this.loginServise.getRol();
    if (rol >= 2) {
      this.restTipoP.getListAccesoTipoPermisoRest(1).subscribe(res => {
        this.tipoPermisos = res;
      });
    } else {
      this.restTipoP.getTipoPermisoRest().subscribe(datos => {
        this.tipoPermisos = datos;
      });
    }
  }

  ContarDiasLibres(dateFrom, dateTo) {
    var from = moment(dateFrom, 'DD/MM/YYY'),
      to = moment(dateTo, 'DD/MM/YYY'),
      days = 0,
      libres = 0;
    while (!from.isAfter(to)) {
      /** Si no es sábado ni domingo */
      if (from.isoWeekday() !== 6 && from.isoWeekday() !== 7) {
        days++;
      }
      else {
        libres++
      }
      from.add(1, 'days');
    }
    return libres;
  }

  ImprimirDiaLibre(form, ingreso) {
    if (form.solicitarForm === 'Días' || form.solicitarForm === 'Días y Horas') {
      var libre = this.ContarDiasLibres(form.fechaInicioForm, ingreso);
      this.PermisoForm.patchValue({
        diaLibreForm: libre,
      });
    }
  }

  dSalida: any;
  validarFechaSalida(event) {
    this.LimpiarCamposFecha();
    //this.dSalida = event.value._i.date;
    this.dSalida = event.value;
    console.log('fecha Salida', moment(this.dSalida));
    console.log(event);

  }

  dIngreso: any;
  validarFechaIngreso(event, form) {
    if (form.fechaInicioForm != '' && form.idPermisoForm != '') {
      this.horasTrabajo = [];
      let datosFechas = {
        id_emple: parseInt(localStorage.getItem('empleado')),
        fecha: form.fechaInicioForm
      }
      this.dIngreso = event.value;
      this.restH.BuscarNumeroHoras(datosFechas).subscribe(datos => {
        this.horasTrabajo = datos;
        console.log("horas", this.horasTrabajo[0].horas);
        this.VerificarDiasHoras(form, this.horasTrabajo[0].horas);
      }, error => {
        this.toastr.info('Las fechas indicadas no se encuentran dentro de su horario laboral', 'VERIFICAR');
        this.LimpiarCamposFecha();
      });
    }
    else {
      this.toastr.error('Aún no selecciona un Tipo de Permiso o aún no ingresa fecha de salida.', 'VERIFICAR');
      this.LimpiarCamposFecha();
    }
  }

  ImprimirDatos(form) {
    this.LimpiarCamposFecha();
    this.datosPermiso = [];
    this.restTipoP.getOneTipoPermisoRest(form.idPermisoForm).subscribe(datos => {
      this.datosPermiso = datos;
      console.log(this.datosPermiso);
      if (this.datosPermiso[0].num_dia_maximo === 0) {
        this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras = false;
        this.estiloDias = { 'visibility': 'hidden' }; this.HabilitarDias = true;
        this.estiloDiasL = { 'visibility': 'hidden' }; this.HabilitarDiasL = true;
        this.PermisoForm.patchValue({
          solicitarForm: 'Horas',
          horasForm: this.datosPermiso[0].num_hora_maximo,
          diasForm: '',
        });
        this.Thoras = this.datosPermiso[0].num_hora_maximo;
        this.tipoPermisoSelec = 'Horas';
      }
      else if (this.datosPermiso[0].num_hora_maximo === '00:00:00') {
        this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
        this.estiloDiasL = { 'visibility': 'visible' }; this.HabilitarDiasL = false;
        this.estiloHoras = { 'visibility': 'hidden' }; this.HabilitarHoras = true;
        this.PermisoForm.patchValue({
          solicitarForm: 'Días',
          diasForm: this.datosPermiso[0].num_dia_maximo,
          horasForm: '',
          diaLibreForm: '',
        });
        this.Tdias = this.datosPermiso[0].num_dia_maximo;
        this.tipoPermisoSelec = 'Días';
      }
      else {
        this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
        this.estiloDiasL = { 'visibility': 'visible' }; this.HabilitarDiasL = false;
        this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras = false;
        this.PermisoForm.patchValue({
          solicitarForm: 'Días y Horas',
          diasForm: this.datosPermiso[0].num_dia_maximo,
          horasForm: this.datosPermiso[0].num_hora_maximo,
          diaLibreForm: this.datoNumPermiso[0].dia_libre,
        });
        this.Tdias = this.datosPermiso[0].num_dia_maximo;
        this.Thoras = this.datosPermiso[0].num_hora_maximo;
        this.tipoPermisoSelec = 'Días y Horas';
      }
    })
  }

  ActivarDiasHoras(form) {
    if (form.solicitarForm === 'Días') {
      this.LimpiarCamposFecha();
      this.PermisoForm.patchValue({
        diasForm: '',
      });
      this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
      this.estiloDiasL = { 'visibility': 'visible' }; this.HabilitarDiasL = false;
      this.estiloHoras = { 'visibility': 'hidden' }; this.HabilitarHoras = true;
      this.toastr.info('Ingresar número de días de permiso');
    }
    else if (form.solicitarForm === 'Horas') {
      this.LimpiarCamposFecha();
      this.PermisoForm.patchValue({
        horasForm: '',
        diaLibreForm: '',
      });
      this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras = false;
      this.estiloDias = { 'visibility': 'hidden' }; this.HabilitarDias = true;
      this.estiloDiasL = { 'visibility': 'hidden' }; this.HabilitarDiasL = true;
      this.toastr.info('Ingresar número de horas y minutos de permiso');
    }
    else {
      this.LimpiarCamposFecha();
      this.PermisoForm.patchValue({
        diasForm: '',
        horasForm: '',
        diaLibreForm: '',
      });
      this.estiloDias = { 'visibility': 'visible' }; this.HabilitarDias = false;
      this.estiloDiasL = { 'visibility': 'visible' }; this.HabilitarDiasL = false;
      this.estiloHoras = { 'visibility': 'visible' }; this.HabilitarHoras = false;
      this.toastr.info('Ingresar número de días máximos y horas permitidas de permiso');
    }
  }

  CambiarValoresDiasHoras(form, datos) {
    if (form.solicitarForm === 'Días') {
      datos.hora_numero = '00:00';
    }
    else if (form.solicitarForm === 'Horas') {
      datos.dia = 0;
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
      descripcion: form.descripcionForm,
      fec_inicio: form.fechaInicioForm,
      fec_final: form.fechaFinalForm,
      dia: parseInt(form.diasForm),
      dia_libre: form.diaLibreForm,
      id_tipo_permiso: form.idPermisoForm,
      hora_numero: form.horasForm,
      num_permiso: this.num,
      anterior_doc: this.datos.documento,
      docu_nombre: form.nombreCertificadoForm,
    }
    if (this.isChecked === false) {
      datosPermiso.anterior_doc = null,
      datosPermiso.docu_nombre = null
    }
    console.log(datosPermiso);
    this.CambiarValoresDiasHoras(form, datosPermiso);
    console.log(datosPermiso);
    this.CambiarValorDiaLibre(datosPermiso);
  }

  CambiarValorDiaLibre(datos) {
    if (datos.dia_libre === '') {
      datos.dia_libre = 0;
      this.ActualizarDatos(datos);
    }
    else {
      this.ActualizarDatos(datos);
    }
  }

  RegistrarPermiso(form) {
    this.InsertarPermiso(form);
  }

  RevisarIngresoDias(form) {
    if (parseInt(form.diasForm) <= this.Tdias) {
      const resta = this.dIngreso.diff(this.dSalida, 'days');
      console.log('datos', resta, ' ');
      if (resta != form.diasForm) {
        this.toastr.error('Recuerde el día de ingreso no puede superar o ser menor a los días de permiso solicitados.',
          'Día de ingreso incorrecto.');
        this.LimpiarCamposFecha();
      }
      else {
        this.ImprimirDiaLibre(form, this.dIngreso);
      }
    }
    else {
      this.toastr.info('Los días de permiso que puede solicitar deben ser menores o iguales a: ' + String(this.Tdias) + ' días.',
        'De acuerdo con la configuración de este tipo de permiso.')
      this.LimpiarCamposFecha();
    }
  }

  RevisarIngresoHoras() {
    const resta = this.dIngreso.diff(this.dSalida, 'days');
    if (resta != 0) {
      this.toastr.error('Recuerde su permiso es por horas, y debe ingresar el mismo día en el que sale.',
        'Día de ingreso incorrecto');
      this.LimpiarCamposFecha();
    }
  }

  MensajeIngresoHoras(hora_empleado) {
    if (this.tipoPermisoSelec === 'Días' || this.tipoPermisoSelec === 'Días y Horas') {
      this.toastr.info('Usted puede solicitar hasta: ' + String(this.Tdias) +
        ' dias de permiso. Si solicita horas recuerde que deben ser menor a ' + hora_empleado + ' horas.',
        'De acuerdo con la configuración de este tipo de permiso');
      this.LimpiarCamposFecha();
    }
    else if (this.tipoPermisoSelec === 'Horas') {
      this.toastr.info('Las horas de permiso que puede solicitar deben ser menores o iguales a: ' + String(this.Thoras) + ' horas',
        'De acuerdo con la configuración de este tipo de permiso');
      this.LimpiarCamposFecha();
    }
  }

  ValidarConfiguracionDias(form) {
    if (this.tipoPermisoSelec === 'Días') {
      this.RevisarIngresoDias(form);
    }
    else if (this.tipoPermisoSelec === 'Horas') {
      this.toastr.info
        ('No puede solicitar días de permiso. Las horas de permiso que puede solicitar deben ser menores o iguales a: ' + String(this.Thoras) + ' horas.',
          'Este tipo de permiso esta configurado por horas.')
      this.LimpiarCamposFecha();
    }
    else if (this.tipoPermisoSelec === 'Días y Horas') {
      this.RevisarIngresoDias(form);
    }
  }

  ValidarConfiguracionHoras(form, hora_empleado) {
    var datoHora = parseInt(hora_empleado.split(":"));
    if (this.tipoPermisoSelec === 'Días') {
      if (parseInt(form.horasForm.split(":")) < datoHora) {
        this.RevisarIngresoHoras();
      }
      else {
        this.MensajeIngresoHoras(hora_empleado);
      }
    }
    else if (this.tipoPermisoSelec === 'Horas') {
      if (form.horasForm <= this.Thoras) {
        this.RevisarIngresoHoras();
      }
      else {
        this.MensajeIngresoHoras(hora_empleado);
      }
    }
    else if (this.tipoPermisoSelec === 'Días y Horas') {
      //console.log("comparar horas", parseInt(datoHora));
      if (parseInt(form.horasForm.split(":")) < datoHora) {
        this.RevisarIngresoHoras();
      }
      else {
        this.MensajeIngresoHoras(hora_empleado);
      }
    }
  }

  RevisarIngresoDiasHoras(contarDias, form) {
    const resta = this.dIngreso.diff(this.dSalida, 'days');
    if (resta != contarDias) {
      this.toastr.error('Recuerde el día de ingreso no puede superar o ser menor a los días de permiso solicitados',
        'Día de ingreso incorrecto');
      this.LimpiarCamposFecha();
    }
    else {
      this.ImprimirDiaLibre(form, this.dIngreso);
    }
  }

  ValidarConfiguracionDiasHoras(form, hora_empleado) {
    var datoHora = hora_empleado.split(":");
    if (this.tipoPermisoSelec === 'Días') {
      var contarDias = parseInt(form.diasForm) + 1;
      if (contarDias <= this.Tdias && parseInt(form.horasForm.split(":")) < parseInt(datoHora)) {
        console.log('verificar dias y horas', contarDias);
        this.RevisarIngresoDiasHoras(contarDias, form);
      }
      else {
        this.toastr.info('Los días de permiso que puede solicitar deben ser menores a : '
          + String(this.Tdias) + ' días y las horas deben ser menores a ' + datoHora + ' horas. Tenga en cuenta que solicita días y adicional horas.',
          'De acuerdo con la configuración de este tipo de permiso.')
        this.LimpiarCamposFecha();
      }

    }
    else if (this.tipoPermisoSelec === 'Horas') {
      this.toastr.info
        ('No puede solicitar días de permiso. Las horas de permiso que puede solicitar deben ser menores o iguales a: '
          + String(this.Thoras) + ' horas. Tenga en cuenta que solicita días y adicional horas',
          'Este tipo de permiso esta configurado por horas.')
      this.LimpiarCamposFecha();

    }
    else if (this.tipoPermisoSelec === 'Días y Horas') {
      var contarDias = parseInt(form.diasForm) + 1

      if (parseInt(form.diasForm) === this.Tdias && form.horasForm <= this.Thoras) {
        this.RevisarIngresoDiasHoras(contarDias, form);
      }
      else if (parseInt(form.diasForm) < this.Tdias && parseInt(form.horasForm.split(":")) < parseInt(datoHora)) {
        this.RevisarIngresoDiasHoras(contarDias, form);
      }
      else {
        this.toastr.info
          ('Los días de permiso que puede solicitar deben ser menores o iguales a: ' + String(this.Tdias) +
            ' día y las horas deben ser menores o iguales a: ' + String(this.Thoras) + ' horas',
            'De acuerdo con la configuración de este tipo de permiso.');
        this.LimpiarCamposFecha();
      }
    }

  }

  VerificarDiasHoras(form, hora_empleado) {
    if (form.solicitarForm === 'Días') {
      if (form.diasForm === '' || form.diasForm == 0) {
        this.toastr.info('Aún no ha ingresado número de días de permiso.');
        this.LimpiarCamposFecha();
      }
      else {
        this.ValidarConfiguracionDias(form);
      }
    }

    else if (form.solicitarForm === 'Horas') {
      if (form.horasForm === '' || form.horasForm === '00:00') {
        this.toastr.info('Aún no ha ingresado número de horas y minutos de permiso.');
        this.LimpiarCamposFecha();
      }
      else {
        this.ValidarConfiguracionHoras(form, hora_empleado);
      }
    }

    else if (form.solicitarForm === 'Días y Horas') {
      if ((form.diasForm === '' && form.horasForm === '' || form.horasForm === '00:00') ||
        (form.diasForm == 0 && form.horasForm == '' || form.horasForm == '00:00') ||
        (form.diasForm != 0 && form.horasForm == '' || form.horasForm == '00:00') ||
        (form.horasForm != '' && form.diasForm == 0 || form.diasForm === '')) {
        this.toastr.info('Aún no ha ingresado número de días u horas y minutos de permiso.', 'VERIFICAR');
        this.LimpiarCamposFecha();
      }
      else {
        this.ValidarConfiguracionDiasHoras(form, hora_empleado);
      }
    }
  }

  NotifiRes: any;
  ActualizarDatos(datos) {
    if (this.isChecked === true) {
      this.LimpiarNombreArchivo();
      if (this.archivoSubido != undefined) {
        if (this.archivoSubido[0].size <= 2e+6) {
          this.restP.EditarPermiso(this.datos.id ,datos).subscribe(response => {
            this.toastr.success('Operación Exitosa', 'Permiso Editado');
            this.LimpiarCampos();
            console.log(response);
            this.SubirRespaldo(this.datos.id)
          });
        }
        else {
          this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB');
        }
      } else {
        this.toastr.info('Falta que suba un archivo', 'Seleccione un archivo');
      }
      
    } else {
      console.log(datos);
      this.restP.EditarPermiso(this.datos.id ,datos).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Permiso Editado');
        this.LimpiarCampos();
        this.dialogRef.close(true)
        console.log(response);
      });
    }

  }

  LimpiarCampos() {
    this.PermisoForm.reset();
  }

  LimpiarCamposFecha() {
    this.PermisoForm.patchValue({
      fechaFinalForm: '',
      diaLibreForm: '',
    });
  }

  LimpiarNombreArchivo() {
    this.PermisoForm.patchValue({
      nombreCertificadoForm: '',
    });
  }

  CerrarVentanaPermiso() {
    this.LimpiarCampos();
    this.dialogRef.close(false);
  }


  /** *******************************************************************
   *  SUBIR ARCHIVO
   *  *******************************************************************
   */

  nameFile: string;
  archivoSubido: Array<File>;

  fileChange(element) {
    this.archivoSubido = element.target.files;
    if (this.archivoSubido.length != 0) {
      const name = this.archivoSubido[0].name;
      console.log(this.archivoSubido[0].name);
      this.PermisoForm.patchValue({ nombreCertificadoForm: name });
    }
  }

  SubirRespaldo(id: number) {
    let formData = new FormData();
    console.log("tamaño", this.archivoSubido[0].size);
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.restP.SubirArchivoRespaldo(formData, id).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Documento subido con exito');
      this.archivoForm.reset();
      this.nameFile = '';
      this.dialogRef.close(true);
    });
  }

  /** ********************************************************************************
   *  MENSAJES QUE INDICAN ERRORES AL INGRESAR DATOS
   *  ********************************************************************************
   */
  ObtenerMensajeErrorDescripcion() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Ingresar una descripción válida';
    }
    return this.descripcionF.hasError('required') ? 'Campo Obligatorio' : '';
  }

  ObtenerMensajeFecha() {
    if (this.fechaFinalF.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

}
