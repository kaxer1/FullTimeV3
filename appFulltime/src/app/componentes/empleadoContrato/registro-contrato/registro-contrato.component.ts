import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { RegimenService } from 'src/app/servicios/catalogos/catRegimen/regimen.service';


@Component({
  selector: 'app-registro-contrato',
  templateUrl: './registro-contrato.component.html',
  styleUrls: ['./registro-contrato.component.css']
})
export class RegistroContratoComponent implements OnInit {

  // Datos Régimen
  regimenLaboral: any = [];
  seleccionarRegimen;

  // Control de campos y validaciones del formulario
  idEmpleadoF = new FormControl('', [Validators.required]);
  idRegimenF = new FormControl('', [Validators.required]);
  fechaIngresoF = new FormControl('', [Validators.required]);
  fechaSalidaF = new FormControl('');
  controlVacacionesF = new FormControl('', [Validators.required]);
  controlAsistenciaF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public ContratoForm = new FormGroup({
    idEmpleadoForm: this.idEmpleadoF,
    idRegimenForm: this.idRegimenF,
    fechaIngresoForm: this.fechaIngresoF,
    fechaSalidaForm: this.fechaSalidaF,
    controlVacacionesForm: this.controlVacacionesF,
    controlAsistenciaForm: this.controlAsistenciaF

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
    this.ContratoForm.patchValue({
      idEmpleadoForm: this.datoEmpleado,
    });
  }

  ObtenerRegimen() {
    this.regimenLaboral = [];
    this.restR.ConsultarRegimen().subscribe(datos => {
      this.regimenLaboral = datos;
      this.regimenLaboral[this.regimenLaboral.length] = { nombre: "Seleccionar Régimen" };
      this.seleccionarRegimen = this.regimenLaboral[this.regimenLaboral.length - 1].nombre;
    })
  }

  ValidarDatosContrato(form) {
    if (form.fechaSalidaForm === '') {
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

  InsertarContrato(form) {
    let datosContrato = {
      id_empleado: form.idEmpleadoForm,
      fec_ingreso: form.fechaIngresoForm,
      fec_salida: form.fechaSalidaForm,
      vaca_controla: form.controlVacacionesForm,
      asis_controla: form.controlAsistenciaForm,
      id_regimen: form.idRegimenForm,
    };
    this.rest.CrearContratoEmpleado(datosContrato).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Contrato registrado')
      this.CerrarVentanaRegistroContrato();
    }, error => {
      this.toastr.error('Operación Fallida', 'Contrato no fue registrado')
    });
  }



  LimpiarCampos() {
    this.ContratoForm.reset();
  }

  CerrarVentanaRegistroContrato() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
