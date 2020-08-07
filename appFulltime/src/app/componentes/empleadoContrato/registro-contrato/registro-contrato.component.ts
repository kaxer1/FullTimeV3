import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { RegimenService } from 'src/app/servicios/catalogos/catRegimen/regimen.service';


@Component({
  selector: 'app-registro-contrato',
  templateUrl: './registro-contrato.component.html',
  styleUrls: ['./registro-contrato.component.css'],
  //encapsulation: ViewEncapsulation.None
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class RegistroContratoComponent implements OnInit {

  isChecked: boolean = false;

  // Datos Régimen
  regimenLaboral: any = [];
  empleados: any = [];
  seleccionarRegimen;

  // Control de campos y validaciones del formulario
  idEmpleadoF = new FormControl('', [Validators.required]);
  idRegimenF = new FormControl('', [Validators.required]);
  fechaIngresoF = new FormControl('', [Validators.required]);
  fechaSalidaF = new FormControl('');
  controlVacacionesF = new FormControl('', [Validators.required]);
  controlAsistenciaF = new FormControl('', [Validators.required]);
  nombreContratoF = new FormControl('');
  archivoForm = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public ContratoForm = new FormGroup({
    idEmpleadoForm: this.idEmpleadoF,
    idRegimenForm: this.idRegimenF,
    fechaIngresoForm: this.fechaIngresoF,
    fechaSalidaForm: this.fechaSalidaF,
    controlVacacionesForm: this.controlVacacionesF,
    controlAsistenciaForm: this.controlAsistenciaF,
    nombreContratoForm: this.nombreContratoF
  });

  constructor(
    private rest: EmpleadoService,
    private restR: RegimenService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroContratoComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any
  ) { }

  ngOnInit(): void {
    this.regimenLaboral = this.ObtenerRegimen();
    this.ObtenerEmpleados(this.datoEmpleado);
  }

  ObtenerRegimen() {
    this.regimenLaboral = [];
    this.restR.ConsultarRegimen().subscribe(datos => {
      this.regimenLaboral = datos;
      this.regimenLaboral[this.regimenLaboral.length] = { nombre: "Seleccionar Régimen" };
      this.seleccionarRegimen = this.regimenLaboral[this.regimenLaboral.length - 1].nombre;
    })
  }

  // metodo para ver la informacion del empleado 
  ObtenerEmpleados(idemploy: any) {
    this.empleados = [];
    this.rest.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleados = data;
      console.log(this.empleados)
      this.ContratoForm.patchValue({
        idEmpleadoForm: this.empleados[0].nombre + ' ' + this.empleados[0].apellido,
      })
    })
  }

  ValidarDatosContrato(form) {
    if (form.fechaSalidaForm === '' || form.fechaSalidaForm === null) {
      form.fechaSalidaForm = null;
      this.InsertarContrato(form);
    } else {
      if (Date.parse(form.fechaIngresoForm) < Date.parse(form.fechaSalidaForm)) {
        this.InsertarContrato(form);
      }
      else {
        this.toastr.info('La fecha de salida debe ser mayor a la fecha de ingreso')
      }
    }
  }

  contador: number = 0;
  InsertarContrato(form) {
    let datosContrato = {
      id_empleado: this.datoEmpleado,
      fec_ingreso: form.fechaIngresoForm,
      fec_salida: form.fechaSalidaForm,
      vaca_controla: form.controlVacacionesForm,
      asis_controla: form.controlAsistenciaForm,
      id_regimen: form.idRegimenForm,
      doc_nombre: form.nombreContratoForm
    };
    this.ValidarDuplicidad(datosContrato, form);
  }

  ValidarDuplicidad(datos, form): any {
    this.revisarFecha = [];
    this.rest.BuscarContratoEmpleadoRegimen(this.datoEmpleado).subscribe(data => {
      this.revisarFecha = data;
      var ingreso = String(moment(datos.fec_ingreso, "YYYY/MM/DD").format("YYYY-MM-DD"));
      console.log('fechas', ingreso, ' ', this.revisarFecha);
      for (var i = 0; i <= this.revisarFecha.length - 1; i++) {
        console.log('fechas1', this.revisarFecha[i].fec_ingreso.split('T')[0]);
        if (this.revisarFecha[i].fec_ingreso.split('T')[0] === ingreso) {
          this.contador = 1;
        }
      }
      if (this.contador === 1) {
        this.toastr.error('La fecha de ingreso de contrato ya se encuentra registrada.', 'Contrato ya existe.')
        this.contador = 0;
      }
      else {
        if (form.nombreContratoForm === '') {
          this.rest.CrearContratoEmpleado(datos).subscribe(response => {
            this.toastr.success('Operación Exitosa', 'Contrato registrado')
            this.CerrarVentanaRegistroContrato();
          }, error => {
            this.toastr.error('Operación Fallida', 'Contrato no fue registrado')
          });
        }
        else {
          this.GuardarDatos(datos);
        }
      }
    });
  }

  HabilitarBtn: boolean = false;
  deseleccionarArchivo() {
    this.archivoSubido = [];
    this.isChecked = false;
    this.HabilitarBtn = false;
    this.LimpiarNombreArchivo();
    this.archivoForm.patchValue('');
  }

  nameFile: string;
  archivoSubido: Array<File>;

  fileChange(element) {
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
      this.toastr.success('Operación Exitosa', 'Contrato subido con exito');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  idContratoRegistrado: any;
  revisarFecha: any = [];
  GuardarDatos(datos) {
    if (this.archivoSubido[0].size <= 2e+6) {
      this.rest.CrearContratoEmpleado(datos).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Contrato registrado')
        this.idContratoRegistrado = response;
        console.log('ver id', response);
        this.CargarContrato(this.idContratoRegistrado.id);
        this.CerrarVentanaRegistroContrato();
      }, error => {
        this.toastr.error('Operación Fallida', 'Contrato no fue registrado')
      });
    }
    else {
      this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB');
    }
  }



  LimpiarCampos() {
    this.ContratoForm.reset();
    this.contador = 0;
  }

  LimpiarNombreArchivo() {
    this.ContratoForm.patchValue({
      nombreContratoForm: '',
    });
  }

  CerrarVentanaRegistroContrato() {
    this.LimpiarCampos();
    this.dialogRef.close();
    //window.location.reload();
  }

}
