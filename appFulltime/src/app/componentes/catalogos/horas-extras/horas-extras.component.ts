import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorasExtrasService } from 'src/app/servicios/catalogos/horas-extras.service';

interface TipoDescuentos{
  value: string;
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

  public nuevaHoraExtraForm = new FormGroup({
    descripcionForm: this.descripcion,
    tipoDescuentoForm: this.tipoDescuento,
    recaPorcentajeForm: this.recaPorcentaje,
    diaHoraExtraForm: this.diaHoraExtra, //campo extra para poder almacenar el dia
    horaInicioForm: this.horaInicio,
    horaFinalForm: this.horaFinal,
    horaJornadaForm: this.horaJornada,
    tipoDiaForm: this.tipoDia,
    codigoForm: this.codigo,
    inclAlmuerzoForm: this.inclAlmuerzo,
    tipoFuncionForm: this.tipoFuncion
  });

  descuentos: TipoDescuentos[] = [
    {value: '1', viewValue: 'desc1'},
    {value: '2', viewValue: 'desc2'},
    {value: '3', viewValue: 'desc3'},
    {value: '4', viewValue: 'desc4'},
  ];

  constructor(
    private toastr: ToastrService,
    private rest: HorasExtrasService
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
  }

  formatLabel(value: number) {
    return value + '%';
  }

  insertarHoraExtra(form) {
    let fechaHoraInicio = form.diaHoraExtraForm + ' ' + form.horaInicioForm + ':00';
    let fechaHoraFin = form.diaHoraExtraForm + ' ' + form.horaFinalForm + ':00';
    let dataHoraExtra = {
      descripcion: form.descripcionForm,
      tipo_descuento: form.tipoDescuentoForm,
      reca_porcentaje: form.recaPorcentajeForm,
      hora_inicio: fechaHoraInicio,
      hora_final: fechaHoraFin,
      hora_jornada: form.horaJornadaForm,
      tipo_dia: form.tipoDiaForm,
      codigo: form.codigoForm,
      incl_almuerzo: form.inclAlmuerzoForm,
      tipo_funcion: form.tipoFuncionForm
    };
    console.log(dataHoraExtra);

    this.rest.postHoraExtraRest(dataHoraExtra)
      .subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Hora extra guardada');
        // this.limpiarCampos();
        this.nuevaHoraExtraForm.reset();
      }, error => {
        console.log(error);
      });;
  }

  limpiarCampos() {
    this.nuevaHoraExtraForm.reset();
  }

}
