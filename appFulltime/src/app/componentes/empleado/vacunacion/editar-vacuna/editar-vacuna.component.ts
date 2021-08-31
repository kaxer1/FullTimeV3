// IMPORTAR LIBRERIAS
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

// IMPORTAR SERVICIOS
import { VacunacionService } from 'src/app/servicios/empleado/empleadoVacunas/vacunacion.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';

// IMPORTAR COMPONENTES
import { VerEmpleadoComponent } from '../../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-editar-vacuna',
  templateUrl: './editar-vacuna.component.html',
  styleUrls: ['./editar-vacuna.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ]
})
export class EditarVacunaComponent implements OnInit {

  // DATOS EXTRAIDOS DEL COMPONENTE IMPORTADO
  @Input() idEmploy: string;
  @Input() dvacuna: any;

  constructor(
    public toastr: ToastrService, // VARIABLE USADA EN NOTIFICACIONES
    public validar: ValidacionesService, // VARIABLE USADA EN VALIDACIONES
    public restVacuna: VacunacionService, // SERVICIO DE DATOS DE VACUNACIÓN
    public metodos: VerEmpleadoComponent, // VARIABLE USADA PARA LEER MÉTODO DE COMPONENTE IMPORTADO
  ) { }

  ngOnInit(): void {
    this.ObtenerTipoVacunas();
    this.tipoVacuna[this.tipoVacuna.length] = { nombre: "OTRO" };
    this.MostrarDatos();
  }

  // VARIABLES VISUALIZACIÓN INGRESO DE TIPO DE VACUNA
  ingresarTipo: boolean = true;
  estilo: any;

  // VARIABLES DE SLECCIÓN DE DOSIS
  estado_1: boolean = false;
  estado_2: boolean = false;
  estado_3: boolean = false;

  // VARIABLES PARA HABILITAR FECHAS
  fecha_1: boolean = false;
  fecha_2: boolean = false;
  fecha_3: boolean = false;

  // VARIABLES DE ALMACENAMINETO DE DATOS
  tipoVacuna: any = [];

  // VALIDACIONES DE CAMPOS DE FORMULARIO
  idTipoF = new FormControl('');
  fecha1F = new FormControl('');
  fecha2F = new FormControl('');
  fecha3F = new FormControl('');
  nombreF = new FormControl('');
  archivoF = new FormControl('');
  certificadoF = new FormControl('');

  // FORMULARIO DENTRO DE UN GRUPO
  public vacunaForm = new FormGroup({
    certificadoForm: this.certificadoF,
    archivoForm: this.archivoF,
    nombreForm: this.nombreF,
    idTipoForm: this.idTipoF,
    fecha1Form: this.fecha1F,
    fecha2Form: this.fecha2F,
    fecha3Form: this.fecha3F,
  });

  // MÉTODO PARA CONSULTAR DATOS DE TIPO DE VACUNA
  ObtenerTipoVacunas() {
    this.tipoVacuna = [];
    this.restVacuna.ListarTiposVacuna().subscribe(data => {
      this.tipoVacuna = data;
      this.tipoVacuna[this.tipoVacuna.length] = { nombre: "OTRO" };
    });
  }

  // MÉTODO PARA INGRESAR SOLO LETRAS EN EL FORMULARIO
  IngresarSoloLetras(e) {
    return this.validar.IngresarSoloLetras(e);
  }

  // MÉTODO PARA MOSTRAR DATOS DE VACUNA
  MostrarDatos() {
    this.vacunaForm.patchValue({
      fecha1Form: this.dvacuna[0].fecha_1,
      fecha2Form: this.dvacuna[0].fecha_2,
      fecha3Form: this.dvacuna[0].fecha_3,
      idTipoForm: this.dvacuna[0].id_tipo_vacuna,
    })
    this.estado_1 = this.fecha_1 = this.dvacuna[0].dosis_1;
    this.estado_2 = this.fecha_2 = this.dvacuna[0].dosis_2;
    this.estado_3 = this.fecha_3 = this.dvacuna[0].dosis_3;
  }

  // MÉTODO PARA QUITAR ARCHIVO SELECCIONADO
  HabilitarBtn: boolean = false;
  RetirarArchivo() {
    this.archivoSubido = [];
    this.HabilitarBtn = false;
    this.LimpiarNombreArchivo();
    this.archivoF.patchValue('');
  }

  // MÉTODO PARA SELECCIONAR UN ARCHIVO
  nameFile: string;
  archivoSubido: Array<File>;
  fileChange(element) {
    this.archivoSubido = element.target.files;
    if (this.archivoSubido.length != 0) {
      const name = this.archivoSubido[0].name;
      this.vacunaForm.patchValue({ certificadoForm: name });
      this.HabilitarBtn = true;
    }
  }

  // MÉTODO PARA LIMPIAR FORMULARIO
  LimpiarCampos() {
    this.vacunaForm.reset();
    this.HabilitarBtn = false;
    this.ingresarTipo = true;
    this.estado_1 = false;
    this.estado_2 = false;
    this.estado_3 = false;
    this.fecha_1 = false;
    this.fecha_2 = false;
    this.fecha_3 = false;
  }

  // MÉTODO PARA CERRAR VENTANA DE REGISTRO
  CerrarRegistro() {
    this.metodos.MostrarVentanaVacuna();
  }

  // MÉTODO PARA LIMPIAR NOMBRE DEL ARCHIVO SELECCIONADO
  LimpiarNombreArchivo() {
    this.vacunaForm.patchValue({
      certificadoForm: '',
    });
  }

  // MÉTODO PARA VISUALIZAR CAMPO REGISTRO DE TIPO DE VACUNA
  ActivarDesactivarNombre(form) {
    if (form.idTipoForm === undefined) {
      this.vacunaForm.patchValue({
        nombreForm: '',
      });
      this.estilo = { 'visibility': 'visible' }; this.ingresarTipo = false;
      this.toastr.info('Ingresar nombre de tipo de vacuna.', 'Etiqueta Registrar Vacuna activa.', {
        timeOut: 6000,
      })
    }
    else {
      this.vacunaForm.patchValue({
        nombreForm: '',
      });
      this.estilo = { 'visibility': 'hidden' }; this.ingresarTipo = true;
    }
  }

  // MÉTODO PARA REGISTRAR TIPO DE VACUNA
  GuardarTipoVacuna(form) {
    let tipoVacunas = {
      nombre: form.nombreForm,
    }
    this.restVacuna.CrearTipoVacuna(tipoVacunas).subscribe(response => {
      this.restVacuna.ConsultarUltimoId().subscribe(data => {
        this.GuardarDatosCarnet(form, data[0].max);
      });
    }, error => { });
  }

  // MÉTODO PARA GUARDAR DATOS DE REGISTRO DE VACUNACIÓN 
  GuardarDatosCarnet(form, id_tipo) {
    let dataCarnet = {
      dosis_1: this.estado_1,
      dosis_2: this.estado_2,
      dosis_3: this.estado_3,
      id_tipo_vacuna: id_tipo,
      fecha_1: form.fecha1Form,
      fecha_2: form.fecha2Form,
      fecha_3: form.fecha3Form,
      nom_carnet: form.certificadoForm,
    }
    if (this.dvacuna[0].nom_carnet != '' && this.dvacuna[0].nom_carnet != null &&
      (form.certificadoForm === '' || form.certificadoForm === null || form.certificadoForm === undefined)) {
      dataCarnet.nom_carnet = this.dvacuna[0].nom_carnet;
    }
    this.MensajeFechas(form, dataCarnet);
    this.restVacuna.ActualizarRegistroVacuna(this.dvacuna[0].id, dataCarnet).subscribe(response => {
      this.toastr.success(this.mensaje, 'Registro Vacunación guardado.', {
        timeOut: 6000,
      });
      this.metodos.ObtenerDatosVacunas();
      if (form.certificadoForm === '' || form.certificadoForm === null || form.certificadoForm === undefined) {
        this.CerrarRegistro();
      }
    }, error => { });
  }

  // MÉTODO PARA CREAR REGISTRO SEGÚN LA SELECCIÓN DE TIPO DE VACUNA
  CrearRegistroVacuna(form) {
    if (form.idTipoForm === undefined || form.idTipoForm === '' || form.idTipoForm === null) {
      if (form.nombreForm != '' && form.nombreForm != null && form.nombreForm != undefined) {
        this.GuardarTipoVacuna(form);
      }
      else {
        this.toastr.warning('Ingresar nombre de un tipo de vacuna.', '', {
          timeOut: 6000,
        })
      }
    }
    else {
      this.GuardarDatosCarnet(form, form.idTipoForm);
    }
  }

  // MÉTODO PARA GUARDAR ARCHIVO SELECCIONADO
  CargarDocumento(idEmpleado: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.restVacuna.SubirDocumento(formData, idEmpleado).subscribe(res => {
      this.archivoF.reset();
      this.nameFile = '';
    });
  }

  // MÉTODO PARA GUARDAR DATOS DE REGISTROS SI EL ARCHIVO CUMPLE CON LOS REQUISITOS
  VerificarArchivo(form) {
    if (this.archivoSubido[0].size <= 2e+6) {
      this.CrearRegistroVacuna(form);
      this.CargarDocumento(parseInt(this.idEmploy));
      this.metodos.ObtenerDatosVacunas();
      this.CerrarRegistro();
    }
    else {
      this.toastr.warning('El archivo ha excedido el tamaño permitido.', 'Tamaño de archivos permitido máximo 2MB.', {
        timeOut: 6000,
      });
    }
  }

  // MÉTODO PARA REGISTRAR DATOS EN EL SISTEMA
  GuardarDatosSistema(form) {
    if (form.certificadoForm != '' && form.certificadoForm != null && form.certificadoForm != undefined) {
      this.VerificarArchivo(form);
    }
    else {
      this.CrearRegistroVacuna(form);
    }
  }

  // MÉTODO PARA VER CAMPO FECHA 1
  VerFecha_1(estado: boolean) {
    this.estado_1 = estado;
    if (this.estado_1 === true) {
      this.fecha_1 = true;
    }
    else {
      this.fecha_1 = false;
      this.fecha1F.reset();
    }
  }

  // MÉTODO PARA VER CAMPO FECHA 2
  VerFecha_2(estado: boolean) {
    this.estado_2 = estado;
    if (this.estado_2 === true) {
      this.fecha_2 = true;
    }
    else {
      this.fecha_2 = false;
      this.fecha2F.reset();
    }
  }

  // MÉTODO PARA VER CAMPO FECHA 3
  VerFecha_3(estado: boolean) {
    this.estado_3 = estado;
    if (this.estado_3 === true) {
      this.fecha_3 = true;
    }
    else {
      this.fecha_3 = false;
      this.fecha3F.reset();
    }
  }

  // MÉTODO PARA ENVIAR MENSAJE INDICANDO QUE DEBE ACTUALIZAR REGISTRO
  mensaje: string = '';
  MensajeFechas(form, datos: any) {
    let frase = 'Recuerde actualizar su registro de vacunación e ingresar fechas correspondientes a cada dosis recibida.';
    if (this.estado_1 === true) {
      if (form.fecha1Form === '' || form.fecha1Form === null || form.fecha1Form === undefined) {
        this.mensaje = frase;
        datos.fecha_1 = null;
      }
    }
    else {
      datos.fecha_1 = null;
    }
    if (this.estado_2 === true) {
      if (form.fecha2Form === '' || form.fecha2Form === null || form.fecha2Form === undefined) {
        this.mensaje = frase;
        datos.fecha_2 = null;
      }
    }
    else {
      datos.fecha_2 = null;
    }
    if (this.estado_3 === true) {
      if (form.fecha3Form === '' || form.fecha3Form === null || form.fecha3Form === undefined) {
        this.mensaje = frase;
        datos.fecha_3 = null;
      }
    }
    else {
      datos.fecha_3 = null;
    }
  }

}
