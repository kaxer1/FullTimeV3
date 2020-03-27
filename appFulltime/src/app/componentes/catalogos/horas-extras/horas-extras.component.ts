import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorasExtrasService } from 'src/app/servicios/catalogos/horas-extras.service';

interface TipoDescuentos{
  value: number;
  viewValue: string;
}

interface Algoritmo{
  value: number;
  viewValue: string;
}

interface Horario{
  value: number;
  viewValue: string;
}

interface Dia{
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.css']
})
export class HorasExtrasComponent implements OnInit {

  descripcion = new FormControl('', Validators.required);
  tipoDescuento = new FormControl('', Validators.required);
  recaPorcentaje = new FormControl('', Validators.required);
  horaInicio = new FormControl('', Validators.required);
  horaFinal = new FormControl('', Validators.required);
  horaJornada = new FormControl('', Validators.required);
  tipoDia = new FormControl('', Validators.required);
  codigo = new FormControl('', Validators.required);
  inclAlmuerzo = new FormControl('', Validators.required);
  tipoFuncion = new FormControl('', Validators.required);
  diaHoraExtra = new FormControl('', Validators.required);

  descuentos: TipoDescuentos[] = [
    {value: 1, viewValue: 'Horas Extras'},
    {value: 2, viewValue: 'Extraordinarias'}
  ];

  tipoFuncionAlg: Algoritmo[] = [
    {value: 1, viewValue: 'Algoritmo1'},
    {value: 2, viewValue: 'Algoritmo2'},
    {value: 3, viewValue: 'Algoritmo3'}
  ];

  horario: Horario[] = [
    {value: 1, viewValue: 'Diurna'},
    {value: 2, viewValue: 'Nocturna'}
  ];

  dia: Dia[] = [
    {value: 1, viewValue: 'Libre'},
    {value: 2, viewValue: 'Feriado'},
    {value: 3, viewValue: 'Normal'}
  ];

  isLinear = true;
  primeroFormGroup: FormGroup;
  segundoFormGroup: FormGroup;

  constructor(
    private toastr: ToastrService,
    private rest: HorasExtrasService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
    this.primeroFormGroup = this._formBuilder.group({
      descripcionForm: this.descripcion,
      tipoDescuentoForm: this.tipoDescuento,
      recaPorcentajeForm: this.recaPorcentaje,
      diaHoraExtraForm: this.diaHoraExtra, //campo extra para poder almacenar el dia
      horaInicioForm: this.horaInicio,
      horaFinalForm: this.horaFinal
    });
    this.segundoFormGroup = this._formBuilder.group({
      horaJornadaForm: this.horaJornada,
      tipoDiaForm: this.tipoDia,
      codigoForm: this.codigo,
      inclAlmuerzoForm: this.inclAlmuerzo,
      tipoFuncionForm: this.tipoFuncion
    });
  }

  formatLabel(value: number) {
    return value + '%';
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 43) || key == 45 || (key >= 47 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  obtenerMensajeErrorDescripcion(){
    if (this.descripcion.hasError('required')) {
      return 'Debe ingresar la descripcion de la hora extra';
    }
  }

  insertarHoraExtra(form1, form2) {
    let fechaHoraInicio = form1.diaHoraExtraForm + ' ' + form1.horaInicioForm + ':00';
    let fechaHoraFin = form1.diaHoraExtraForm + ' ' + form1.horaFinalForm + ':00';
    let dataHoraExtra = {
      descripcion: form1.descripcionForm,
      tipo_descuento: form1.tipoDescuentoForm,
      reca_porcentaje: form1.recaPorcentajeForm,
      hora_inicio: fechaHoraInicio,
      hora_final: fechaHoraFin,
      hora_jornada: form2.horaJornadaForm,
      tipo_dia: form2.tipoDiaForm,
      codigo: form2.codigoForm,
      incl_almuerzo: form2.inclAlmuerzoForm,
      tipo_funcion: form2.tipoFuncionForm
    };

    this.rest.postHoraExtraRest(dataHoraExtra)
      .subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Hora extra guardada');
      }, error => {
        console.log(error);
      });;
  }

  limpiarCampos() {
    // this.nuevaHoraExtraForm.reset();
  }

}
