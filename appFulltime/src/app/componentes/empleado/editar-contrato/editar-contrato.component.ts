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

  // Control de campos y validaciones del formulario
  idRegimenF = new FormControl('', [Validators.required]);
  fechaIngresoF = new FormControl('', [Validators.required]);
  fechaSalidaF = new FormControl('');
  controlVacacionesF = new FormControl('', [Validators.required]);
  controlAsistenciaF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public ContratoForm = new FormGroup({
    idRegimenForm: this.idRegimenF,
    fechaIngresoForm: this.fechaIngresoF,
    fechaSalidaForm: this.fechaSalidaF,
    controlVacacionesForm: this.controlVacacionesF,
    controlAsistenciaForm: this.controlAsistenciaF
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

  ObtenerContratoSeleccionado(id: number){
    this.rest.ObtenerUnContrato(id).subscribe(res => {
      this.UnContrato = res;
      this.ContratoForm.setValue({
        idRegimenForm: this.UnContrato.id_regimen,
        fechaIngresoForm: this.UnContrato.fec_ingreso,
        fechaSalidaForm: this.UnContrato.fec_salida,
        controlVacacionesForm: this.UnContrato.vaca_controla,
        controlAsistenciaForm: this.UnContrato.asis_controla
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
    if (form.fechaSalidaForm === '') {
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
    };
    this.rest.ActualizarContratoEmpleado(this.idSelectContrato, this.idEmpleado, datosContrato).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Contrato Actualizado');
      this.verEmpleado.obtenerContratoEmpleadoRegimen();
      this.cancelar();
    }, error => {
      this.toastr.error('Operación Fallida', 'Contrato no fue registrado')
    });
  }

  cancelar(){this.verEmpleado.verContratoEdicion(true);}

}
