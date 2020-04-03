import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TipoPermisosService } from 'src/app/servicios/catalogos/tipo-permisos.service';
import { ToastrService } from 'ngx-toastr';

interface TipoDescuentos {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-tipo-permisos',
  templateUrl: './tipo-permisos.component.html',
  styleUrls: ['./tipo-permisos.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TipoPermisosComponent implements OnInit {

  descuentos: TipoDescuentos[] = [
    { value: '1', viewValue: 'desc1' },
    { value: '2', viewValue: 'desc2' },
    { value: '3', viewValue: 'desc3' },
    { value: '4', viewValue: 'desc4' },
  ];

  isLinear = false;
  primeroFormGroup: FormGroup;
  segundoFormGroup: FormGroup;
  terceroFormGroup: FormGroup;

  constructor(
    private rest: TipoPermisosService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.primeroFormGroup = this._formBuilder.group({
      descripcionForm: ['', Validators.required],
      tipoDescuentoForm: ['', Validators.required],
      numDiaMaximoForm: ['', Validators.required],
      numHoraMaximoForm: ['', Validators.required],
      numDiaIngresoForm: ['', Validators.required],
      numDiaJustificaForm: ['', Validators.required],
      acceEmpleadoForm: ['', Validators.required],
    });
    this.segundoFormGroup = this._formBuilder.group({
      vacaAfectaForm: ['', Validators.required],
      anioAcumulaForm: ['', Validators.required],
      correoForm: ['', Validators.required],
      geneJustificacionForm: ['', Validators.required],
      fecValidarForm: ['', Validators.required],
      actualizarForm: ['', Validators.required],
    });
    this.terceroFormGroup = this._formBuilder.group({
      autorizarForm: ['', Validators.required],
      eliminarForm: ['', Validators.required],
      legalizarForm: ['', Validators.required],
      noautorizarForm: ['', Validators.required],
      preautorizarForm: ['', Validators.required],
      almuIncluirForm: ['', Validators.required]
    });
  }

  insertarTipoPermiso(form1, form2, form3) {
    let dataTipoPermiso = {
      descripcion: form1.descripcionForm,
      tipo_descuento: form1.tipoDescuentoForm,
      num_dia_maximo: form1.numDiaMaximoForm,
      num_hora_maximo: form1.numHoraMaximoForm,
      num_dia_ingreso: form1.numDiaIngresoForm,
      vaca_afecta: form2.vacaAfectaForm,
      anio_acumula: form2.anioAcumulaForm,
      correo: form2.correoForm,
      gene_justificacion: form2.geneJustificacionForm,
      fec_validar: form2.fecValidarForm,
      acce_empleado: form1.acceEmpleadoForm,
      actualizar: form2.actualizarForm,
      autorizar: form3.autorizarForm,
      eliminar: form3.eliminarForm,
      legalizar: form3.legalizarForm,
      noautorizar: form3.noautorizarForm,
      preautorizar: form3.preautorizarForm,
      almu_incluir: form3.almuIncluirForm,
      num_dia_justifica: form1.numDiaJustificaForm
    }

    this.rest.postTipoPermisoRest(dataTipoPermiso).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Tipo Permiso guardado');
    }, error => {
      console.log(error);
    });
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  limpiarCampos() {
    this.terceroFormGroup.reset();
    this.segundoFormGroup.reset();
    this.primeroFormGroup.reset();
  }

}
