import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { VacunacionService } from 'src/app/servicios/empleado/empleadoVacunas/vacunacion.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-vacuna',
  templateUrl: './crear-vacuna.component.html',
  styleUrls: ['./crear-vacuna.component.css']
})

export class CrearVacunaComponent implements OnInit {

  @Input() idEmploy: string;
  @Input() editar: string;

  constructor(
    public restVacuna: VacunacionService,
    public validar: ValidacionesService,
    public toastr: ToastrService,
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
  idTipoF = new FormControl('', [Validators.required]);
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

  HabilitarBtn: boolean = false;
  deseleccionarArchivo() {
    this.archivoSubido = [];
    //  this.isChecked = false;
    this.HabilitarBtn = false;
    //this.LimpiarNombreArchivo();
    this.archivoF.patchValue('');
  }

  nameFile: string;
  archivoSubido: Array<File>;

  fileChange(element) {
    this.archivoSubido = element.target.files;
    if (this.archivoSubido.length != 0) {
      const name = this.archivoSubido[0].name;
      console.log(this.archivoSubido[0].name);
      //this.ContratoForm.patchValue({ nombreContratoForm: name });
      this.HabilitarBtn = true;
    }
  }

  CargarContrato(id: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    /*this.rest.SubirContrato(formData, id).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Contrato subido con exito', {
        timeOut: 6000,
      });
      this.archivoForm.reset();
      this.nameFile = '';
    });*/
  }

  // MÉTODO PARA GUARDAR REGISTROS
  idContratoRegistrado: any;
  revisarFecha: any = [];
  GuardarDatos(datos) {
    if (this.archivoSubido[0].size <= 2e+6) {
      /*  this.rest.CrearContratoEmpleado(datos).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Contrato registrado', {
            timeOut: 6000,
          })
          this.idContratoRegistrado = response;
          console.log('ver id', response);
          this.CargarContrato(this.idContratoRegistrado.id);
          this.CerrarVentanaRegistroContrato();
        }, error => {
          this.toastr.error('Operación Fallida', 'Contrato no fue registrado', {
            timeOut: 6000,
          })
        });*/
    }
    else {
      this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB', {
        timeOut: 6000,
      });
    }
  }

  // MÉTODO PARA LIMPIAR FORMULARIO
  LimpiarCampos() {

  }

  // MÉTODO PARA CERRAR VENTANA DE REGISTRO
  CerrarRegistro() {

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
}
