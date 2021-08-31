import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { VacunacionService } from 'src/app/servicios/empleado/empleadoVacunas/vacunacion.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { ToastrService } from 'ngx-toastr';
import { VerEmpleadoComponent } from '../../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-crear-vacuna',
  templateUrl: './crear-vacuna.component.html',
  styleUrls: ['./crear-vacuna.component.css']
})

export class CrearVacunaComponent implements OnInit {

  @Input() idEmploy: string;

  constructor(
    public restVacuna: VacunacionService,
    public validar: ValidacionesService,
    public toastr: ToastrService,
    public metodos: VerEmpleadoComponent,
  ) { }

  ngOnInit(): void {
    this.ObtenerTipoVacunas();
    this.tipoVacuna[this.tipoVacuna.length] = { nombre: "OTRO" };

  }

  // VARIABLES VISUALIZACIÓN INGRESO DE TIPO DE VACUNA
  ingresarTipo: boolean = true;
  estilo: any;

  // VARIABLES DE ALMACENAMINETO DE DATOS
  tipoVacuna: any = [];

  // VALIDACIONES DE CAMPOS DE FORMULARIO
  idTipoF = new FormControl('');
  dosisF = new FormControl('', [Validators.required]);
  archivoF = new FormControl('');
  nombreF = new FormControl('');
  certificadoF = new FormControl('');

  // FORMULARIO DENTRO DE UN GRUPO
  public vacunaForm = new FormGroup({
    certificadoForm: this.certificadoF,
    archivoForm: this.archivoF,
    nombreForm: this.nombreF,
    idTipoForm: this.idTipoF,
    dosisForm: this.dosisF,
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
    this.HabilitarBtn = false;
    this.ingresarTipo = true;
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
      id_empleado: parseInt(this.idEmploy),
      id_tipo_vacuna: id_tipo,
      dosis: form.dosisForm,
      nom_carnet: form.certificadoForm,
    }
    this.restVacuna.CrearRegistroVacunacion(dataCarnet).subscribe(response => {
      this.toastr.success('Operacion Exitosa', 'Registro Vacunación guardado.', {
        timeOut: 6000,
      });
      if (form.certificadoForm === '' || form.certificadoForm === null || form.certificadoForm === undefined) {
        this.CerrarRegistro();
        this.metodos.ObtenerDatosVacunas();
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
      this.CerrarRegistro();
      this.metodos.ObtenerDatosVacunas();
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

}
