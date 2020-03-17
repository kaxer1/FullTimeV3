import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { ToastrService } from 'ngx-toastr';

// ayuda para crear las Discapacidades
interface Discapacidad {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-discapacidad',
  templateUrl: './discapacidad.component.html',
  styleUrls: ['./discapacidad.component.css']
})
export class DiscapacidadComponent implements OnInit {

  carnet = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  porcentaje = new FormControl('', [Validators.required, Validators.maxLength(6)]);
  tipo = new FormControl('', [Validators.required, Validators.maxLength(10)])

  public nuevoCarnetForm = new FormGroup({
    carnetForm: this.carnet,
    porcentajeForm: this.porcentaje,
    tipoForm: this.tipo
  });

  // Arreglo de discapacidades existentes
  discapacidades: Discapacidad[] = [
    {value: 'fisica', viewValue: 'Física'},
    {value: 'intelectua', viewValue: 'Intelectual'},
    {value: 'auditiva', viewValue: 'Auditiva'},
    {value: 'visual', viewValue: 'Visual'},
    {value: 'psicosocia', viewValue: 'Psicosocial'}
  ];
  
  constructor(
    private rest: DiscapacidadService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
  }

  obtenerMensajeErrorCarnet() {
    if (this.carnet.hasError('required')) {
      return 'Debe ingresar el carnet';
    }
    return this.carnet.hasError('maxLength') ? 'ingresar solo 255 caracteres' : '';
  }

  formatLabel(value: number) {
    return value + '%';
  }

  insertarCarnet(form){
    let dataCarnet = {
      id_empleado: 3,
      carn_conadis: form.carnetForm,
      porcentaje: form.porcentajeForm,
      tipo: form.tipoForm,
    }

    this.rest.postDiscapacidadRest(dataCarnet)
    .subscribe(response => {
      this.toastr.success('Operacion Exitosa', 'Discapacidad guardada');
      this.limpiarCampos();
    }, error => {
      console.log(error);
    });
  }

  limpiarCampos(){
    this.nuevoCarnetForm.reset();
  }

}
