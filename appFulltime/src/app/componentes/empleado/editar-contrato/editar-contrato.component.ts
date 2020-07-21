import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RegimenService } from 'src/app/servicios/catalogos/catRegimen/regimen.service';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { VerEmpleadoComponent } from '../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-editar-contrato',
  templateUrl: './editar-contrato.component.html',
  styleUrls: ['./editar-contrato.component.css']
})
export class EditarContratoComponent implements OnInit {

  @Input() idSelectContrato: number;
  @Input() idEmpleado: number;

  // Datos Régimen
  regimenLaboral: any = [];
  UnContrato: any = [];
  seleccionarRegimen;

  contador: number = 0;

  // Control de campos y validaciones del formulario
  idRegimenF = new FormControl('', [Validators.required]);
  fechaIngresoF = new FormControl('', [Validators.required]);
  fechaSalidaF = new FormControl('');
  controlVacacionesF = new FormControl('', [Validators.required]);
  controlAsistenciaF = new FormControl('', [Validators.required]);
  nombreContratoF = new FormControl('');
  archivoForm = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public ContratoForm = new FormGroup({
    idRegimenForm: this.idRegimenF,
    fechaIngresoForm: this.fechaIngresoF,
    fechaSalidaForm: this.fechaSalidaF,
    controlVacacionesForm: this.controlVacacionesF,
    controlAsistenciaForm: this.controlAsistenciaF,
    nombreContratoForm: this.nombreContratoF
  });

  constructor(
    private restRegimen: RegimenService,
    private rest: EmpleadoService,
    private verEmpleado: VerEmpleadoComponent,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.regimenLaboral = this.ObtenerRegimen();
    this.ObtenerContratoSeleccionado(this.idSelectContrato);
  }

  ObtenerContratoSeleccionado(id: number) {
    this.rest.ObtenerUnContrato(id).subscribe(res => {
      this.UnContrato = res;
      this.ContratoForm.setValue({
        idRegimenForm: this.UnContrato.id_regimen,
        fechaIngresoForm: this.UnContrato.fec_ingreso,
        fechaSalidaForm: this.UnContrato.fec_salida,
        controlVacacionesForm: this.UnContrato.vaca_controla,
        controlAsistenciaForm: this.UnContrato.asis_controla,
        nombreContratoForm: this.UnContrato.doc_nombre
      })
    });
  }

  ObtenerRegimen() {
    this.regimenLaboral = [];
    this.restRegimen.ConsultarRegimen().subscribe(datos => {
      this.regimenLaboral = datos;
      this.regimenLaboral[this.regimenLaboral.length] = { nombre: "Seleccionar Régimen" };
      this.seleccionarRegimen = this.regimenLaboral[this.regimenLaboral.length - 1].nombre;
    })
  }

  ValidarDatosContrato(form) {
    if (form.fechaSalidaForm === '' || form.fechaSalidaForm === null) {
      form.fechaSalidaForm = null;
      this.ActualizarContrato(form);
    } else {
      if (Date.parse(form.fechaIngresoForm) < Date.parse(form.fechaSalidaForm)) {
        this.ActualizarContrato(form);
      }
      else {
        this.toastr.info('La fecha de salida debe ser mayor a la fecha de ingreso')
      }
    }
  }


  ActualizarContrato(form) {
    let datosContrato = {
      fec_ingreso: form.fechaIngresoForm,
      fec_salida: form.fechaSalidaForm,
      vaca_controla: form.controlVacacionesForm,
      asis_controla: form.controlAsistenciaForm,
      id_regimen: form.idRegimenForm,
      doc_nombre: form.nombreContratoForm
    };
    if (form.nombreCertificadoForm === '') {
      datosContrato.doc_nombre = null;
      this.rest.ActualizarContratoEmpleado(this.idSelectContrato, this.idEmpleado, datosContrato).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Datos de Contrato Actualizado');
        this.ModificarDocumento();
        this.verEmpleado.obtenerContratoEmpleadoRegimen();
        this.cancelar();
      }, error => {
        this.toastr.error('Operación Fallida', 'Datos de Contrato no fueron actualizados')
      });
    }
    else {
      if (this.contador === 0) {
        this.GuardarDatos(datosContrato);
      }
      else {
        this.ActualizarDatos(datosContrato);
      }
    }
  }

  nameFile: string;
  archivoSubido: Array<File>;

  fileChange(element) {
    this.contador = 1;
    this.archivoSubido = element.target.files;
    if (this.archivoSubido.length != 0) {
      const name = this.archivoSubido[0].name;
      console.log(this.archivoSubido[0].name);
      this.ContratoForm.patchValue({ nombreContratoForm: name });
    }
  }

  CargarContrato(id: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.SubirContrato(formData, id).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Contrato subido con exito');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  ModificarDocumento() {
    let datoDocumento = {
      documento: null
    }
    this.rest.EditarDocumento(this.idSelectContrato, datoDocumento).subscribe(response => {
    }, error => { });
  }

  GuardarDatos(datos) {
    this.rest.ActualizarContratoEmpleado(this.idSelectContrato, this.idEmpleado, datos).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Datos de Contrato actualizado');
      this.verEmpleado.obtenerContratoEmpleadoRegimen();
      this.cancelar();
    }, error => {
      this.toastr.error('Operación Fallida', 'Datos de Contrato no pudieron ser actualizados')
    });
  }

  ActualizarDatos(datos) {
    if (this.archivoSubido[0].size <= 2e+6) {
      this.rest.ActualizarContratoEmpleado(this.idSelectContrato, this.idEmpleado, datos).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Datos de Contrato actualizado');
        this.CargarContrato(this.idSelectContrato);
        this.verEmpleado.obtenerContratoEmpleadoRegimen();
        this.cancelar();
      }, error => {
        this.toastr.error('Operación Fallida', 'Datos de Contrato no pudieron ser actualizados')
      });
    }
    else {
      this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB');
    }
  }

  LimpiarNombreArchivo() {
    this.ContratoForm.patchValue({
      nombreContratoForm: '',
    });
  }

  cancelar() { this.verEmpleado.verContratoEdicion(true); }

}
