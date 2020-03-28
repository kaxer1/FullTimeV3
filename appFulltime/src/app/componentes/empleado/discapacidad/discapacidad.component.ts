import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VerEmpleadoComponent } from '../ver-empleado/ver-empleado.component';

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

  @Input() idEmploy: string;

  carnet = new FormControl('', [Validators.required, Validators.maxLength(8)]);
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
    private metodo: VerEmpleadoComponent
  ) {}
  
  ngOnInit(): void {
    this.limpiarCampos();
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  obtenerMensajeErrorCarnet() {
    if (this.carnet.hasError('required')) {
      return 'Debe ingresar N° de carnet';
    }
    return this.carnet.hasError('maxLength') ? 'ingresar hasta 7 caracteres' : '';
  }

  formatLabel(value: number) {
    return value + '%';
  }

  insertarCarnet(form){
    let dataCarnet = {
      id_empleado: parseInt(this.idEmploy),
      carn_conadis: form.carnetForm,
      porcentaje: form.porcentajeForm,
      tipo: form.tipoForm,
    }

    this.rest.postDiscapacidadRest(dataCarnet)
    .subscribe(response => {
      this.toastr.success('Operacion Exitosa', 'Discapacidad guardada');
      this.limpiarCampos();
      this.metodo.obtenerDiscapacidadEmpleado(this.idEmploy);
    }, error => {
      // console.log(error);
    });
  }

  limpiarCampos(){
    this.nuevoCarnetForm.reset();
  }
  
  cerrarRegistro(){
    this.metodo.mostrarDis();
  }

}
