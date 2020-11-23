import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RegimenService } from 'src/app/servicios/catalogos/catRegimen/regimen.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

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

  isChecked: boolean;

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
      if (this.UnContrato.doc_nombre != '' && this.UnContrato.doc_nombre != null) {
        this.HabilitarBtn = true;
        this.isChecked = true;
      }
      else {
        this.HabilitarBtn = false;
        this.isChecked = false;
      }
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
        this.toastr.info('La fecha de salida debe ser mayor a la fecha de ingreso','', {
          timeOut: 6000,
        })
      }
    }
  }

  HabilitarBtn: boolean = false;
  deseleccionarArchivo() {
    this.archivoSubido = [];
    this.isChecked = false;
    this.LimpiarNombreArchivo();
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
    if (datosContrato.fec_ingreso === this.UnContrato.fec_ingreso) {
      this.RegistrarContrato(datosContrato);
    }
    else {
      this.ValidarDuplicidad(datosContrato, form);
    }
  }

  revisarFecha: any = [];
  duplicado: number = 0;
  ValidarDuplicidad(datos, form): any {
    this.revisarFecha = [];
    this.rest.BuscarContratoEmpleadoRegimen(this.UnContrato.id_empleado).subscribe(data => {
      this.revisarFecha = data;
      var ingreso = String(moment(datos.fec_ingreso, "YYYY/MM/DD").format("YYYY-MM-DD"));
      console.log('fechas', ingreso, ' ', this.revisarFecha);
      for (var i = 0; i <= this.revisarFecha.length - 1; i++) {
        console.log('fechas1', this.revisarFecha[i].fec_ingreso.split('T')[0]);
        if (this.revisarFecha[i].fec_ingreso.split('T')[0] === ingreso) {
          this.duplicado = 1;
        }
      }
      if (this.duplicado === 1) {
        this.toastr.error('La fecha de ingreso de contrato ya se encuentra registrada.', 'Contrato ya existe.', {
          timeOut: 6000,
        })
        this.duplicado = 0;
      }
      else {
        if (form.nombreContratoForm === '') {
          datos.doc_nombre = null;
          this.rest.ActualizarContratoEmpleado(this.idSelectContrato, this.idEmpleado, datos).subscribe(response => {
            this.toastr.success('Operación Exitosa', 'Datos de Contrato Actualizado', {
              timeOut: 6000,
            });
            this.ModificarDocumento();
            this.verEmpleado.obtenerContratoEmpleadoRegimen();
            this.cancelar();
          }, error => {
            this.toastr.error('Operación Fallida', 'Datos de Contrato no fueron actualizados', {
              timeOut: 6000,
            })
          });
        }
        else {
          this.RegistrarContrato(datos);
        }
      }
    });
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
      this.HabilitarBtn = true;
    }

  }

  CargarContrato(id: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.SubirContrato(formData, id).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Contrato subido con exito', {
        timeOut: 6000,
      });
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
      this.toastr.success('Operación Exitosa', 'Datos de Contrato actualizado', {
        timeOut: 6000,
      });
      this.verEmpleado.obtenerContratoEmpleadoRegimen();
      this.cancelar();
    }, error => {
      this.toastr.error('Operación Fallida', 'Datos de Contrato no pudieron ser actualizados', {
        timeOut: 6000,
      })
    });
  }

  RegistrarContrato(datos) {
    if (this.contador === 0) {
      this.GuardarDatos(datos);
    }
    else {
      this.ActualizarDatos(datos);
    }
  }

  ActualizarDatos(datos) {
    if (this.archivoSubido[0].size <= 2e+6) {
      this.rest.ActualizarContratoEmpleado(this.idSelectContrato, this.idEmpleado, datos).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Datos de Contrato actualizado', {
          timeOut: 6000,
        });
        this.CargarContrato(this.idSelectContrato);
        this.verEmpleado.obtenerContratoEmpleadoRegimen();
        this.cancelar();
      }, error => {
        this.toastr.error('Operación Fallida', 'Datos de Contrato no pudieron ser actualizados', {
          timeOut: 6000,
        })
      });
    }
    else {
      this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB', {
        timeOut: 6000,
      });
    }
  }

  LimpiarNombreArchivo() {
    this.ContratoForm.patchValue({
      nombreContratoForm: '',
    });
  }

  cancelar() { this.verEmpleado.verContratoEdicion(true); }

}
