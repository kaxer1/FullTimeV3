import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment'

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { LoginService } from 'src/app/servicios/login/login.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';

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
    { valor: 'Días y Horas', nombre: 'Días y Horas' },
  ];
  selec1 = false;
  selec2 = false;
  Tdias = 0;
  Thoras;
  num: number;
  tipoPermisoSelec: string;
  FechaActual: any;

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
  nombreCertificadoF = new FormControl('', Validators.required);

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
    nombreCertificadoForm: this.nombreCertificadoF
  });

  constructor(
    private restTipoP: TipoPermisosService,
    private restP: PermisosService,
    private toastr: ToastrService,
    private loginServise: LoginService,
    private realTime: RealTimeService,
    public dialogRef: MatDialogRef<RegistroEmpleadoPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any,
  ) { }

  ngOnInit(): void {
    console.log(this.datoEmpleado);
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
    this.PermisoForm.patchValue({
      fecCreacionForm: this.FechaActual,
      estadoForm: 'Pendiente'
    });
    this.ObtenerTiposPermiso();
    this.ImprimirNumeroPermiso();
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

  dSalida: number = 0;
  validarFechaSalida(event) {
    this.LimpiarCamposFecha();
    this.dSalida = event.value._i.date;
  }

  dIngreso: number = 0;
  validarFechaIngreso(event, form) {
    if (form.fechaInicioForm != '' && form.idPermisoForm != '') {
      this.dIngreso = event.value._i.date;
      this.VerificarDiasHoras(form);
    }
    else {
      this.toastr.error('Aún no selecciona un Tipo de Permiso o aún no ingresa fecha de salida.', 'VERIFICAR');
      this.LimpiarCamposFecha();
    }
  }

  ImprimirDatos(form) {
    this.LimpiarCamposFecha();
    this.selec1 = false;
    this.selec2 = false;
    this.datosPermiso = [];
    this.restTipoP.getOneTipoPermisoRest(form.idPermisoForm).subscribe(datos => {
      this.datosPermiso = datos;
      console.log(this.datosPermiso);
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
        this.tipoPermisoSelec = 'Horas';
      }
      else if (this.datosPermiso[0].num_hora_maximo === '00:00:00') {
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
        this.tipoPermisoSelec = 'Días';
      }
      else {
        (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'visible';
        (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'visible';
        (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'visible';
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
      if (this.datosPermiso[0].legalizar === true) {
        this.selec1 = true;
      }
      else if (this.datosPermiso[0].legalizar === false) {
        this.selec2 = true;
      }
      this.PermisoForm.patchValue({
        legalizarForm: this.datosPermiso[0].legalizar
      });
    })
  }

  ActivarDiasHoras(form) {
    if (form.solicitarForm === 'Días') {
      this.LimpiarCamposFecha();
      this.PermisoForm.patchValue({
        diasForm: '',
      });
      (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'hidden';
      this.toastr.info('Ingresar número de días de permiso');
    }
    else if (form.solicitarForm === 'Horas') {
      this.LimpiarCamposFecha();
      this.PermisoForm.patchValue({
        horasForm: '',
        diaLibreForm: '',
      });
      (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'hidden';
      (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'hidden';
      this.toastr.info('Ingresar número de horas y minutos de permiso');
    }
    else {
      this.LimpiarCamposFecha();
      this.PermisoForm.patchValue({
        diasForm: '',
        horasForm: '',
        diaLibreForm: '',
      });
      (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('Dlibres')).style.visibility = 'visible';
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
      num_permiso: this.num,
      docu_nombre: form.nombreCertificadoForm
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
    this.InsertarPermiso(form);
  }

  RevisarIngresoDias(form) {
    if (parseInt(form.diasForm) <= this.Tdias) {
      const resta = this.dIngreso - this.dSalida;
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
    if (this.dSalida != this.dIngreso) {
      this.toastr.error('Recuerde su permiso es por horas, y debe ingresar el mismo día en el que sale.',
        'Día de ingreso incorrecto');
      this.LimpiarCamposFecha();
    }
  }

  MensajeIngresoHoras() {
    if (this.tipoPermisoSelec === 'Días' || this.tipoPermisoSelec === 'Días y Horas') {
      this.toastr.info('Usted puede solicitar hasta: ' + String(this.Tdias) +
        ' dias de permiso. Si solicita horas recuerde que deben ser menor a 8 horas.',
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


  ValidarConfiguracionHoras(form) {
    if (this.tipoPermisoSelec === 'Días') {
      if (form.horasForm < '08:00') {
        this.RevisarIngresoHoras();
      }
      else {
        this.MensajeIngresoHoras();
      }
    }
    else if (this.tipoPermisoSelec === 'Horas') {
      if (form.horasForm <= this.Thoras) {
        this.RevisarIngresoHoras();
      }
      else {
        this.MensajeIngresoHoras();
      }
    }
    else if (this.tipoPermisoSelec === 'Días y Horas') {
      if (form.horasForm < '08:00') {
        this.RevisarIngresoHoras();
      }
      else {
        this.MensajeIngresoHoras();
      }
    }
  }

  RevisarIngresoDiasHoras(contarDias, form) {
    const resta = this.dIngreso - this.dSalida;
    if (resta != contarDias) {
      this.toastr.error('Recuerde el día de ingreso no puede superar o ser menor a los días de permiso solicitados',
        'Día de ingreso incorrecto');
      this.LimpiarCamposFecha();
    }
    else {
      this.ImprimirDiaLibre(form, this.dIngreso);
    }
  }

  ValidarConfiguracionDiasHoras(form) {
    if (this.tipoPermisoSelec === 'Días') {
      var contarDias = parseInt(form.diasForm) + 1;
      if (contarDias <= this.Tdias) {
        this.RevisarIngresoDiasHoras(contarDias, form);
      }
      else {
        this.toastr.info('Los días de permiso que puede solicitar deben ser menores o iguales a: '
          + String(this.Tdias) + ' días. Tenga en cuenta que solicita días y adicional horas',
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
      else if (parseInt(form.diasForm) < this.Tdias && form.horasForm < '08:00') {
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

  VerificarDiasHoras(form) {
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
        this.ValidarConfiguracionHoras(form);
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
        this.ValidarConfiguracionDiasHoras(form);
      }
    }
  }


  idPermisoRes: any;
  NotifiRes: any;
  GuardarDatos(datos) {
    this.restP.IngresarEmpleadoPermisos(datos).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Permiso registrado');
      this.LimpiarCampos();
      this.idPermisoRes = res;
      console.log(this.idPermisoRes.estado);
      this.SubirRespaldo(this.idPermisoRes.id)
      this.ImprimirNumeroPermiso();
      var f = new Date();
      let notificacion = { 
        id: null,
        id_send_empl: this.datoEmpleado.idEmpleado,
        id_receives_empl: this.idPermisoRes.id_empleado_autoriza,
        id_receives_depa: this.idPermisoRes.id_departamento_autoriza,
        estado: this.idPermisoRes.estado, 
        create_at: `${this.FechaActual}T${f.toLocaleTimeString()}.000Z`, 
        id_permiso: this.idPermisoRes.id
      }
      this.realTime.IngresarNotificacionEmpleado(notificacion).subscribe(res => {
        console.log(res);
        this.NotifiRes = res;
        notificacion.id = this.NotifiRes._id;
        if (this.NotifiRes._id > 0) {
          this.restP.sendNotiRealTime(notificacion);
        }
      })
    });
  }

  LimpiarCampos() {
    this.PermisoForm.reset();
    this.PermisoForm.patchValue({
      fecCreacionForm: this.FechaActual,
      estadoForm: 'Pendiente'
    });
  }

  LimpiarCamposFecha() {
    this.PermisoForm.patchValue({
      fechaFinalForm: '',
      diaLibreForm: '',
    });
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
    const name = this.archivoSubido[0].name;
    this.PermisoForm.patchValue({ nombreCertificadoForm: name });
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
