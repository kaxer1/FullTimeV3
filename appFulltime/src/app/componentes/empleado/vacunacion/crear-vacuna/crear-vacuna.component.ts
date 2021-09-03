// IMPORTAR LIBRERIAS
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

// IMPORTAR SERVICIOS
import { VacunacionService } from 'src/app/servicios/empleado/empleadoVacunas/vacunacion.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';

// IMPORTAR COMPONENTES
import { VerEmpleadoComponent } from '../../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-crear-vacuna',
  templateUrl: './crear-vacuna.component.html',
  styleUrls: ['./crear-vacuna.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ]
})

export class CrearVacunaComponent implements OnInit {

  // VARIABLE TOMADA DESDE EL COMPONENTE VER IMPORTADO
  @Input() idEmploy: string;

  constructor(
    public toastr: ToastrService, // VARIABLE USADA PARA MENSAJES DE NOTIFICACIONES
    public validar: ValidacionesService, // VARIABLE USADA PARA VALIDACIONES
    public metodos: VerEmpleadoComponent, // VARIABLE USADA PARA EXTRAER MÉTODOS DEL COMPONENTEE IMPORTADO
    public restVacuna: VacunacionService, // CONSULTA DE SERVICIOS DATOS DE VACUNACIÓN
  ) { }

  ngOnInit(): void {
    this.ObtenerTipoVacunas();
    this.tipoVacuna[this.tipoVacuna.length] = { nombre: "OTRO" };
  }

  // VARIABLES VISUALIZACIÓN INGRESO DE TIPO DE VACUNA
  ingresarTipo_1: boolean = true;
  ingresarTipo_2: boolean = true;
  ingresarTipo_3: boolean = true;
  estilo_1: any;
  estilo_2: any;
  estilo_3: any;

  // VARIABLES DE SLECCIÓN DE DOSIS
  estado_1: boolean = false;
  estado_2: boolean = false;
  estado_3: boolean = false;

  // VARIABLES PARA HABILITAR FECHAS
  fecha_1: boolean = false;
  fecha_2: boolean = false;
  fecha_3: boolean = false;

  // VARIABLES DE ALMACENAMIENTO DE DATOS
  tipoVacuna: any = [];

  // VALIDACIONES DE CAMPOS DE FORMULARIO
  fecha1F = new FormControl('');
  fecha2F = new FormControl('');
  fecha3F = new FormControl('');
  archivoF = new FormControl('');
  vacuna_1F = new FormControl('');
  vacuna_2F = new FormControl('');
  vacuna_3F = new FormControl('');
  nombre_1F = new FormControl('');
  nombre_2F = new FormControl('');
  nombre_3F = new FormControl('');
  certificadoF = new FormControl('');

  // FORMULARIO DENTRO DE UN GRUPO
  public vacunaForm = new FormGroup({
    certificadoForm: this.certificadoF,
    vacuna_1Form: this.vacuna_1F,
    vacuna_2Form: this.vacuna_2F,
    vacuna_3Form: this.vacuna_3F,
    nombre_1Form: this.nombre_1F,
    nombre_2Form: this.nombre_2F,
    nombre_3Form: this.nombre_3F,
    archivoForm: this.archivoF,
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
    this.ingresarTipo_1 = true;
    this.ingresarTipo_2 = true;
    this.ingresarTipo_3 = true;
    this.HabilitarBtn = false;
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
  ActivarDesactivarNombre(form, opcion: number) {
    if (opcion === 1) {
      if (form.vacuna_1Form === undefined) {
        this.vacunaForm.patchValue({
          nombre_1Form: '',
        });
        this.estilo_1 = { 'visibility': 'visible' }; this.ingresarTipo_1 = false;
        this.toastr.info('Ingresar nombre de tipo de vacuna.', 'Etiqueta Registrar Vacuna activa.', {
          timeOut: 6000,
        })
      }
      else {
        this.vacunaForm.patchValue({
          nombre_1Form: '',
        });
        this.estilo_1 = { 'visibility': 'hidden' }; this.ingresarTipo_1 = true;
      }
    }
    else if (opcion === 2) {
      if (form.vacuna_2Form === undefined) {
        this.vacunaForm.patchValue({
          nombre_2Form: '',
        });
        this.estilo_2 = { 'visibility': 'visible' }; this.ingresarTipo_2 = false;
        this.toastr.info('Ingresar nombre de tipo de vacuna.', 'Etiqueta Registrar Vacuna activa.', {
          timeOut: 6000,
        })
      }
      else {
        this.vacunaForm.patchValue({
          nombre_2Form: '',
        });
        this.estilo_2 = { 'visibility': 'hidden' }; this.ingresarTipo_2 = true;
      }
    }
    else if (opcion === 3) {
      if (form.vacuna_3Form === undefined) {
        this.vacunaForm.patchValue({
          nombre_3Form: '',
        });
        this.estilo_3 = { 'visibility': 'visible' }; this.ingresarTipo_3 = false;
        this.toastr.info('Ingresar nombre de tipo de vacuna.', 'Etiqueta Registrar Vacuna activa.', {
          timeOut: 6000,
        })
      }
      else {
        this.vacunaForm.patchValue({
          nombre_3Form: '',
        });
        this.estilo_3 = { 'visibility': 'hidden' }; this.ingresarTipo_3 = true;
      }
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
      fecha_1: form.fecha1Form,
      fecha_2: form.fecha2Form,
      fecha_3: form.fecha3Form,
      id_tipo_vacuna_2: id_tipo,
      id_tipo_vacuna_3: id_tipo,
      id_tipo_vacuna_1: id_tipo,
      nom_carnet: form.certificadoForm,
      id_empleado: parseInt(this.idEmploy),
    }
    this.MensajeFechas(form, dataCarnet);
    console.log('datos de entrada', dataCarnet);
    this.restVacuna.CrearRegistroVacunacion(dataCarnet).subscribe(response => {
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
  CargarDocumento(id: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.restVacuna.SubirDocumento(formData, id).subscribe(res => {
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


