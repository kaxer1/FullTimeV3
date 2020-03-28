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

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
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
        this.toastr.success('Operación Exitosa', 'Título guardado');
        this.limpiarCampos();
      }, error => {
        console.log(error);
      });;
  }

  limpiarCampos(){
    this.nuevoTituloForm.reset();
  }

}
