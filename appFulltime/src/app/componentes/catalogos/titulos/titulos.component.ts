import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { TituloService } from 'src/app/servicios/catalogos/titulo.service';
import { ToastrService } from 'ngx-toastr';

// Interface para creación de selección de niveles
interface Nivel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.css']
})
export class TitulosComponent implements OnInit {
  
  // Control de los campos del formulario
  nombre = new FormControl('', Validators.required);
  nivel = new FormControl('', Validators.required)

  // asignar los campos en un formulario en grupo
  public nuevoTituloForm = new FormGroup({
    tituloNombreForm: this.nombre,
    tituloNivelForm: this.nivel,
  });

  // Arreglo de niveles existentes
  niveles: Nivel[] = [
    {value: '1', viewValue: 'Educación Básica'},
    {value: '2', viewValue: 'Bachillerato'},
    {value: '3', viewValue: 'Técnico Superior'},
    {value: '4', viewValue: 'Tercer Nivel'},
    {value: '5', viewValue: 'Postgrado'}
  ];

  constructor(
    private rest: TituloService,
    private toastr: ToastrService,
  ) { 
  }

  ngOnInit(): void {
  }

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 45) || (key >= 47 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  obtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Debe ingresar nombre del título';
    }
    return this.nombre.hasError('pattern') ? 'No ingresar números' : '';
  }

  insertarTitulo(form){
    let dataTitulo = {
      nombre: form.tituloNombreForm,
      nivel: form.tituloNivelForm,
    };

    this.rest.postTituloRest(dataTitulo)
    .subscribe(response => {
        this.toastr.success('Operacion Exitosa', 'Titulo guardado');
        this.limpiarCampos();
      }, error => {
        console.log(error);
      });;
  }

  limpiarCampos(){
    this.nuevoTituloForm.reset();
  }

}
